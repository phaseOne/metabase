import { t } from "ttag";
import {
  createAction,
  createThunkAction,
  handleActions,
  combineReducers,
} from "metabase/lib/redux";
import { addUndo } from "metabase/redux/undo";
import {
  SettingsApi,
  EmailApi,
  SlackApi,
  LdapApi,
  StoreApi,
} from "metabase/services";
import { refreshSiteSettings } from "metabase/redux/settings";
import { LICENSE_ACCEPTED_URL_HASH } from "./constants";

// ACITON TYPES AND ACTION CREATORS

export const reloadSettings = () => async (dispatch, getState) => {
  await Promise.all([
    dispatch(refreshSettingsList()),
    dispatch(refreshSiteSettings()),
  ]);
};

const REFRESH_SETTINGS_LIST = "metabase/admin/settings/REFRESH_SETTINGS_LIST";
export const refreshSettingsList = createAction(
  REFRESH_SETTINGS_LIST,
  async () => {
    const settingsList = await SettingsApi.list();
    return settingsList.map(setting => ({
      ...setting,
      originalValue: setting.value,
    }));
  },
);

export const INITIALIZE_SETTINGS =
  "metabase/admin/settings/INITIALIZE_SETTINGS";
export const initializeSettings = createThunkAction(
  INITIALIZE_SETTINGS,
  () => async (dispatch, getState) => {
    try {
      await dispatch(reloadSettings());
    } catch (error) {
      console.log("error fetching settings", error);
      throw error;
    }
  },
);

export const UPDATE_SETTING = "metabase/admin/settings/UPDATE_SETTING";
export const updateSetting = createThunkAction(UPDATE_SETTING, function(
  setting,
) {
  return async function(dispatch, getState) {
    try {
      await SettingsApi.put(setting);
    } catch (error) {
      console.log("error updating setting", setting, error);
      throw error;
    } finally {
      await dispatch(reloadSettings());
    }
  };
});

export const UPDATE_SETTINGS = "metabase/admin/settings/UPDATE_SETTINGS";
export const updateSettings = createThunkAction(UPDATE_SETTINGS, function(
  settings,
) {
  return async function(dispatch, getState) {
    try {
      await SettingsApi.putAll(settings);
    } catch (error) {
      console.log("error updating settings", settings, error);
      throw error;
    } finally {
      await dispatch(reloadSettings());
    }
  };
});

export const UPDATE_EMAIL_SETTINGS =
  "metabase/admin/settings/UPDATE_EMAIL_SETTINGS";
export const updateEmailSettings = createThunkAction(
  UPDATE_EMAIL_SETTINGS,
  function(settings) {
    return async function(dispatch, getState) {
      try {
        const result = await EmailApi.updateSettings(settings);
        await dispatch(reloadSettings());
        return result;
      } catch (error) {
        console.log("error updating email settings", settings, error);
        throw error;
      }
    };
  },
);

export const SEND_TEST_EMAIL = "metabase/admin/settings/SEND_TEST_EMAIL";
export const sendTestEmail = createThunkAction(SEND_TEST_EMAIL, function() {
  return async function(dispatch, getState) {
    try {
      await EmailApi.sendTest();
    } catch (error) {
      console.log("error sending test email", error);
      throw error;
    }
  };
});

export const CLEAR_EMAIL_SETTINGS =
  "metabase/admin/settings/CLEAR_EMAIL_SETTINGS";

export const clearEmailSettings = createAction(CLEAR_EMAIL_SETTINGS, () =>
  EmailApi.clear(),
);

export const UPDATE_SLACK_SETTINGS =
  "metabase/admin/settings/UPDATE_SLACK_SETTINGS";
export const updateSlackSettings = createThunkAction(
  UPDATE_SLACK_SETTINGS,
  function(settings) {
    return async function(dispatch, getState) {
      try {
        const result = await SlackApi.updateSettings(settings);
        await dispatch(reloadSettings());
        return result;
      } catch (error) {
        console.log("error updating slack settings", settings, error);
        throw error;
      }
    };
  },
  {},
);

export const UPDATE_LDAP_SETTINGS =
  "metabase/admin/settings/UPDATE_LDAP_SETTINGS";
export const updateLdapSettings = createThunkAction(
  UPDATE_LDAP_SETTINGS,
  function(settings) {
    return async function(dispatch, getState) {
      try {
        const result = await LdapApi.updateSettings(settings);
        await dispatch(reloadSettings());
        return result;
      } catch (error) {
        console.log("error updating LDAP settings", settings, error);
        throw error;
      }
    };
  },
);

export const FETCH_LICENSE = "metabase/admin/settings/FETCH_LICENSE";
export const fetchLicense = createThunkAction(FETCH_LICENSE, () => async () => {
  try {
    const status = await StoreApi.tokenStatus();

    return {
      isValid: status.valid,
      // TODO: update one the BE is ready
      plan: "pro", //status.plan,
    };
  } catch (error) {
    console.error("error fetching token status", error);
    throw error;
  }
});

export const UPDATE_LICENSE = "metabase/admin/settings/UPDATE_LICENSE";
export const updateLicense = createThunkAction(
  UPDATE_LICENSE,
  license => async () => {
    try {
      await SettingsApi.put({ key: "premium-embedding-token", value: license });

      // In order to apply pro and enterprise features we need to perform a full reload
      window.location.href += LICENSE_ACCEPTED_URL_HASH;
      window.location.reload();
    } catch {
      return {
        error: t`This token doesn't seem to be valid. Double-check it, then contact support if you think it should be working.`,
      };
    }
  },
);

export const SHOW_LICENSE_ACCEPTED_TOAST =
  "metabase/admin/settings/SHOW_LICENSE_ACCEPTED_TOAST";
export const showLicenseAcceptedToast = createThunkAction(
  SHOW_LICENSE_ACCEPTED_TOAST,
  () => dispatch => {
    dispatch(
      addUndo({
        message: t`Your license is active!`,
      }),
    );
  },
);

// REDUCERS

export const warnings = handleActions(
  {
    [UPDATE_EMAIL_SETTINGS]: {
      next: (state, { payload }) => payload["with-corrections"],
    },
  },
  {},
);

const settings = handleActions(
  {
    [REFRESH_SETTINGS_LIST]: { next: (state, { payload }) => payload },
  },
  [],
);

const license = handleActions(
  {
    [FETCH_LICENSE]: { next: (_state, { payload }) => payload },
    [UPDATE_LICENSE]: {
      next: (state, { payload }) => ({ ...state, ...payload }),
    },
  },
  null,
);

export default combineReducers({
  settings,
  warnings,
  license,
});
