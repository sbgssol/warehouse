import "jquery";

declare module "jquery" {
  interface JQuery<HTMLInputElement> {
    autocomplete(options: any): JQuery<HTMLInputElement>;
  }
}
