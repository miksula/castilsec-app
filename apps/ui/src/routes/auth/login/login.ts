import "@vaadin/password-field";
import "@vaadin/email-field";
import "@vaadin/button";

import { html, LitElement } from "lit";
import { useRouter, useSupabase } from "@/lib/mixins/index.ts";

class LoginComponent extends useSupabase(useRouter(LitElement)) {
  private isSubmitting = false;
  private errorMessage = "";

  private handleRegisterClick(event: Event) {
    event.preventDefault();
    this.router.navigate("/auth/register");
  }

  private async handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    console.log("Login form submitted", event.currentTarget);
    console.log("Current isSubmitting state:", this.isSubmitting);

    if (this.isSubmitting) {
      return;
    }

    const form = (event.target as Element)?.closest("form");
    console.log("Form element found:", form);
    if (!(form instanceof HTMLFormElement)) {
      return;
    }

    const formData = new FormData(form);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    console.log("Extracted email:", email);
    console.log("Extracted password:", password);
    console.log("Supabase instance:", this.supabase);

    this.isSubmitting = true;
    this.errorMessage = "";
    this.requestUpdate();

    console.log("Attempting login with email:", email);
    console.log("Attempting login with password:", password);
    console.log("Supabase instance:", this.supabase);

    try {
      await this.supabase.login(email, password);
      this.router.navigate("/");
    } catch (error) {
      this.errorMessage = error instanceof Error
        ? error.message
        : "Kirjautuminen epaonnistui.";
    } finally {
      this.isSubmitting = false;
      this.requestUpdate();
    }
  }

  override createRenderRoot() {
    return this; // no shadow DOM
  }

  override render() {
    return html`
      <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-sm flex flex-col items-center">
          <div
            class="my-6 h-12 w-auto text-(--text-black)"
          >
            <svg viewBox="0 0 100 100" width="100%" height="100%">
              <path
                d="M50 8 L84 22 L84 53 C84 73 50 92 50 92 C50 92 16 73 16 53 L16 22 Z"
                fill="none"
                stroke="currentColor"
                stroke-width="4.5"
                stroke-linejoin="round"
              />
              <rect x="33" y="33" width="8" height="12" fill="currentColor" rx="1" />
              <rect x="46" y="33" width="8" height="12" fill="currentColor" rx="1" />
              <rect x="59" y="33" width="8" height="12" fill="currentColor" rx="1" />
              <path
                d="M33 44 H67 V64 H33 Z M43 64 L43 58 Q50 48 57 58 L57 64 Z"
                fill="currentColor"
                fill-rule="evenodd"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <h2>
            Kirjaudu sisään tilillesi
          </h2>
        </div>

        <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form class="flex flex-col space-y-5">
            <vaadin-email-field
              id="email"
              name="email"
              label="Sähköposti"
              autocomplete="email"
              error-message="Anna kelvollinen sähköpostiosoite"
              ?disabled="${this.isSubmitting}"
              clear-button-visible
            ></vaadin-email-field>

            <vaadin-password-field
              id="password"
              name="password"
              label="Salasana"
              autocomplete="current-password"
              error-message="Salasana vaaditaan"
              ?disabled="${this.isSubmitting}"
            ></vaadin-password-field>

            ${this.errorMessage
              ? html`
                <p class="text-sm text-red-600 dark:text-red-400">
                  ${this.errorMessage}
                </p>
              `
              : null}

            <div class="flex items-center justify-center mt-2">
              <vaadin-button
                class="w-full"
                theme="primary"
                type="submit"
                ?disabled="${this.isSubmitting}"
                @click="${this.handleSubmit}"
              >
                ${this.isSubmitting ? "Kirjaudutaan..." : "Kirjaudu"}
              </vaadin-button>
            </div>
          </form>

          <p class="mt-10 text-center text-sm/6 text-gray-500 dark:text-gray-400">
            Eikö sinulla ole tiliä?
            <a
              href="/auth/register"
              @click="${this.handleRegisterClick}"
              class="font-semibold text-brand-blue hover:text-brand-blue-dark"
            >Rekisteröidy</a>
          </p>
        </div>
      </div>
      </div>
    `;
  }
}

customElements.define("login-component", LoginComponent);

// Functional export for route component
export function Login() {
  return html`
    <login-component></login-component>
  `;
}
