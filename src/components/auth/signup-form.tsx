"use client";

import { useActionState } from "react";
import { CheckCircle2 } from "lucide-react";

import { signUp, type AuthActionState } from "@/lib/auth/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/auth/submit-button";

const initialState: AuthActionState = {
  status: "idle",
};

export function SignupForm() {
  const [state, formAction] = useActionState(signUp, initialState);

  if (state.status === "success") {
    return (
      <div className="rounded-lg border border-border bg-accent p-4 text-sm text-accent-foreground">
        <CheckCircle2 className="mb-3 size-5" aria-hidden="true" />
        <p className="font-medium">Check your email</p>
        <p className="mt-1 leading-6">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4" noValidate>
      <FieldError id="signup-form-error" messages={state.message ? [state.message] : undefined} />

      <div className="space-y-2">
        <Label htmlFor="displayName">Display name</Label>
        <Input
          id="displayName"
          name="displayName"
          type="text"
          autoComplete="name"
          aria-invalid={Boolean(state.fieldErrors?.displayName)}
          aria-describedby="display-name-error"
          required
        />
        <FieldError id="display-name-error" messages={state.fieldErrors?.displayName} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          aria-invalid={Boolean(state.fieldErrors?.email)}
          aria-describedby="email-error"
          required
        />
        <FieldError id="email-error" messages={state.fieldErrors?.email} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          aria-invalid={Boolean(state.fieldErrors?.password)}
          aria-describedby="password-error"
          required
        />
        <FieldError id="password-error" messages={state.fieldErrors?.password} />
      </div>

      <SubmitButton pendingLabel="Creating account">Create account</SubmitButton>
    </form>
  );
}

function FieldError({ id, messages }: { id: string; messages?: string[] }) {
  if (!messages?.length) {
    return null;
  }

  return (
    <p id={id} className="rounded-md bg-[var(--error-soft)] px-3 py-2 text-sm text-destructive">
      {messages[0]}
    </p>
  );
}
