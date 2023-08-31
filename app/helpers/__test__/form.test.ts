import getForm, { FormError } from "../form";

describe("Form", () => {
  describe("getForm", () => {
    it("should return validate and display functions", () => {
      const form = getForm([]);

      expect(typeof form.validate).toBe("function");
      expect(typeof form.display).toBe("function");
    });
  });

  describe("validate", () => {
    it("should pass validation", () => {
      const { validate } = getForm([{
        name: "text",
        label: "text",
        type: "text",
        required: true,
        placeholder: "text",
        default: "text",
      }]);

      const formData = new FormData();
      formData.set('text', 'text');
      const result = validate(formData);

      expect(result.text).toBeUndefined();
    });

    it("should return required error", () => {
      const { validate } = getForm([{
        name: "text",
        label: "text",
        type: "text",
        required: true,
        placeholder: "text",
        default: "text",
        validationMessage: {
          [FormError.REQUIRED_BUT_EMPTY]: 'text is required',
        }
      }]);

      const formData = new FormData();
      const result = validate(formData);

      expect(result.text).toBe('text is required');
    });
  });
});
