import { SignUpPagePresentation } from './signup-page-presentation'

interface SignUpPageSectionProps {
  redirectTo: string
}

export function SignUpPageSection({ redirectTo }: SignUpPageSectionProps) {
  return <SignUpPagePresentation redirectTo={redirectTo} />
}
