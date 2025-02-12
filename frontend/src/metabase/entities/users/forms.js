import _ from "underscore";

import { t } from "ttag";
import MetabaseSettings from "metabase/lib/settings";
import { PLUGIN_ADMIN_USER_FORM_FIELDS } from "metabase/plugins";
import validate from "metabase/lib/validate";
import FormGroupsWidget from "metabase/components/form/widgets/FormGroupsWidget";

const DETAILS_FORM_FIELDS = () => [
  {
    name: "first_name",
    title: t`First name`,
    placeholder: "Johnny",
    autoFocus: true,
    validate: validate.required().maxLength(100),
  },
  {
    name: "last_name",
    title: t`Last name`,
    placeholder: "Appleseed",
    validate: validate.required().maxLength(100),
  },
  {
    name: "email",
    title: t`Email`,
    placeholder: "youlooknicetoday@email.com",
    validate: validate.required().email(),
  },
];

const LOCALE_FIELD = {
  name: "locale",
  title: t`Language`,
  type: "select",
  options: [
    [null, t`Use site default`],
    ..._.sortBy(
      MetabaseSettings.get("available-locales") || [["en", "English"]],
      ([code, name]) => name,
    ),
  ].map(([code, name]) => ({ name, value: code })),
};

const PASSWORD_FORM_FIELDS = () => [
  {
    name: "password",
    title: t`Create a password`,
    type: "password",
    placeholder: t`Shhh...`,
    validate: validate.required().passwordComplexity(),
  },
  {
    name: "password_confirm",
    title: t`Confirm your password`,
    type: "password",
    placeholder: t`Shhh... but one more time so we get it right`,
    validate: (password_confirm, { values: { password } = {} }) =>
      (!password_confirm && t`required`) ||
      (password_confirm !== password && t`passwords do not match`),
  },
];

export default {
  admin: {
    fields: [
      ...DETAILS_FORM_FIELDS(),
      {
        name: "group_ids",
        title: t`Groups`,
        type: FormGroupsWidget,
      },
      ...PLUGIN_ADMIN_USER_FORM_FIELDS,
    ],
  },
  user: {
    fields: [...DETAILS_FORM_FIELDS(), LOCALE_FIELD],
    disablePristineSubmit: true,
  },
  setup: () => ({
    fields: [
      ...DETAILS_FORM_FIELDS(),
      {
        name: "site_name",
        title: t`Company or team name`,
        placeholder: t`Department of Awesome`,
        validate: validate.required(),
      },
      ...PASSWORD_FORM_FIELDS(),
    ],
  }),
  password: {
    fields: [
      {
        name: "old_password",
        type: "password",
        title: t`Current password`,
        placeholder: t`Shhh...`,
        validate: validate.required(),
      },
      ...PASSWORD_FORM_FIELDS(),
    ],
  },
  password_reset: {
    fields: [...PASSWORD_FORM_FIELDS()],
  },
};
