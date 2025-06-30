
export interface Profile {
  id: string;
  username: string;
  completed_onboarding: boolean;
  selected_ideas: string[];
  selected_avatar: number;
}

export interface AppState {
  currentStep: 'login' | 'onboarding' | 'main';
  onboardingStep: number;
  selectedIdeas: string[];
  selectedAvatar: number;
  profile: Profile | null;
}
