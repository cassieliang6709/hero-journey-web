import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface VoiceInputProps {
  onTranscription: (text: string) => void;
  isProcessing?: boolean;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscription, isProcessing = false }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm'
      });
      
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorderRef.current.onstop = handleRecordingStop;
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      toast.success('开始录音...');
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('无法访问麦克风');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Stop all tracks
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleRecordingStop = async () => {
    if (audioChunksRef.current.length === 0) return;
    
    try {
      setIsTranscribing(true);
      
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      
      // Convert blob to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Audio = (reader.result as string).split(',')[1];
        
        try {
          const { data, error } = await supabase.functions.invoke('voice-to-text', {
            body: { audio: base64Audio }
          });
          
          if (error) throw error;
          
          if (data?.text) {
            onTranscription(data.text);
            toast.success('语音转换成功');
          } else {
            toast.error('未识别到语音内容');
          }
        } catch (error) {
          console.error('Transcription error:', error);
          toast.error('语音转换失败');
        } finally {
          setIsTranscribing(false);
        }
      };
      
      reader.readAsDataURL(audioBlob);
    } catch (error) {
      console.error('Error processing audio:', error);
      toast.error('音频处理失败');
      setIsTranscribing(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <Button
      onClick={toggleRecording}
      disabled={isTranscribing || isProcessing}
      variant={isRecording ? "destructive" : "outline"}
      size="sm"
      className="min-w-[100px]"
    >
      {isTranscribing ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          转换中
        </>
      ) : isRecording ? (
        <>
          <MicOff className="h-4 w-4 mr-2" />
          停止录音
        </>
      ) : (
        <>
          <Mic className="h-4 w-4 mr-2" />
          语音输入
        </>
      )}
    </Button>
  );
};

export default VoiceInput;