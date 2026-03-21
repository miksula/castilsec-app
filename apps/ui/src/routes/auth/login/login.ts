import { html, LitElement } from "lit";
import type Router from "@app/router";
import { noShadow } from "@/lib/mixins/noShadow.ts";
import { useRouter } from "@/lib/mixins/useRouter.ts";
import { useSupabase } from "@/lib/mixins/useSupabase.ts";

// Functional export for route component
export function Login() {
  return html`
    <login-component></login-component>
  `;
}

class LoginComponent extends useSupabase(useRouter(noShadow(LitElement))) {
  declare protected router: Router;
  private isSubmitting = false;
  private errorMessage = "";

  private handleRegisterClick(event: Event) {
    event.preventDefault();
    this.router.navigate("/auth/register");
  }

  private async handleSubmit(event: SubmitEvent) {
    event.preventDefault();

    if (this.isSubmitting) {
      return;
    }

    const form = event.currentTarget;
    if (!(form instanceof HTMLFormElement)) {
      return;
    }

    const formData = new FormData(form);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (!this.supabase) {
      this.errorMessage =
        "Kirjautuminen ei ole viela valmis. Yrita hetken kuluttua uudelleen.";
      this.requestUpdate();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = "";
    this.requestUpdate();

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

  override render() {
    return html`
      <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            src="/logo.svg"
            alt="CastilSec"
            class="mx-auto h-12 w-auto opacity-100"
          />
          <h2
            class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900 dark:text-white"
          >
            Kirjaudu sisään tilillesi
          </h2>
        </div>

        <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form
            action="#"
            method="post"
            class="space-y-6"
            @submit="${this.handleSubmit}"
          >
            <div>
              <label
                for="email"
                class="block text-sm/6 font-medium text-gray-900 dark:text-gray-100"
              >Sähköposti</label>
              <div class="mt-2">
                <input
                  id="email"
                  type="email"
                  name="email"
                  required
                  ?disabled="${this.isSubmitting}"
                  autocomplete="email"
                  class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <div class="flex items-center justify-between">
                <label
                  for="password"
                  class="block text-sm/6 font-medium text-gray-900 dark:text-gray-100"
                >Salasana</label>
                <div class="text-sm">
                  <a
                    href="#"
                    class="font-semibold text-brand-blue hover:text-brand-blue-dark"
                  >Unohditko salasanan?</a>
                </div>
              </div>
              <div class="mt-2">
                <input
                  id="password"
                  type="password"
                  name="password"
                  required
                  ?disabled="${this.isSubmitting}"
                  autocomplete="current-password"
                  class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 sm:text-sm/6"
                />
              </div>
            </div>

            ${this.errorMessage
              ? html`
                <p class="text-sm text-red-600 dark:text-red-400">
                  ${this.errorMessage}
                </p>
              `
              : null}

            <div>
              <button
                type="submit"
                ?disabled="${this.isSubmitting}"
                class="flex w-full justify-center rounded-md bg-black px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
              >
                ${this.isSubmitting ? "Kirjaudutaan..." : "Kirjaudu"}
              </button>
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
