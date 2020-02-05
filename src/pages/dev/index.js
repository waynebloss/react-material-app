import { TestWizardDialogPage } from "./TestWizardDialogPage";

export const DevPages = {
  testWizardDialog: {
    anon: false,
    path: "/dev/test-wizard-dialog",
    title: "Test Wizard Dialog",
    type: "PAGE_TEST_WIZARD_DIALOG",
    view: TestWizardDialogPage,
  },
};
export default DevPages;

export const DevArea = {
  pages: DevPages,
};
