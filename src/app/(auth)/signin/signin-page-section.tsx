import { SignInPagePresentation } from './signin-page-presentation'

interface SignInPageSectionProps {
  redirectTo: string
}

export function SignInPageSection({ redirectTo }: SignInPageSectionProps) {
  return <SignInPagePresentation redirectTo={redirectTo} />
}
