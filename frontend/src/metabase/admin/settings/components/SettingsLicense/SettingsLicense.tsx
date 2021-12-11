import React, { useEffect } from "react";
import { connect } from "react-redux";
import MetabaseSettings from "metabase/lib/settings";
import LoadingSpinner from "metabase/components/LoadingSpinner";
import { StarterContent } from "./content/StarterContent";
import { OssContent } from "./content/OssContent";
import { ProContent } from "./content/ProContent";
import { EnterpriseContent } from "./content/EnterpriseContent";
import {
  fetchLicense,
  updateLicense,
  showLicenseAcceptedToast,
} from "../../settings";
import {
  SettingsLicenseContainer,
  LoaderContainer,
} from "./SettingsLicense.styled";
import { LICENSE_ACCEPTED_URL_HASH } from "../../constants";

interface SettingsLicenseProps {
  license: {
    plan?: string;
    isValid?: boolean;
    error?: string;
  };
  fetchLicense: () => void;
  updateLicense: (license: string) => void;
  showLicenseAcceptedToast: () => void;
  settingValues: Record<string, string>;
}

export const SettingsLicense = ({
  license,
  fetchLicense,
  updateLicense,
  settingValues,
  showLicenseAcceptedToast,
}: SettingsLicenseProps) => {
  const currentLicense = settingValues["premium-embedding-token"];

  useEffect(() => {
    if (window.location.hash === LICENSE_ACCEPTED_URL_HASH) {
      window.location.hash = "";
      showLicenseAcceptedToast();
    }

    if (!currentLicense) {
      return;
    }

    fetchLicense();
  }, []);

  const handleUpdateLicense = (license: string) => {
    updateLicense(license);
  };

  const isOss = !MetabaseSettings.isHosted() && !currentLicense;

  if (isOss) {
    return (
      <OssContent
        error={license?.error}
        onUpdate={handleUpdateLicense}
        currentLicense={currentLicense}
        isValid={license?.isValid}
      />
    );
  }

  if (MetabaseSettings.isPaidPlan() && !currentLicense) {
    return <StarterContent />;
  }

  if (license == null) {
    return (
      <SettingsLicenseContainer>
        <LoaderContainer>
          <LoadingSpinner />
        </LoaderContainer>
      </SettingsLicenseContainer>
    );
  }

  if (license.plan === "pro") {
    return (
      <ProContent
        error={license.error}
        onUpdate={handleUpdateLicense}
        currentLicense={currentLicense}
        isValid={license.isValid}
      />
    );
  }

  return (
    <EnterpriseContent
      error={license.error}
      onUpdate={handleUpdateLicense}
      currentLicense={currentLicense}
      isValid={license.isValid}
    />
  );
};

const mapStateToProps = (state: any) => ({
  license: state.admin.settings.license,
});

const mapDispatchToProps = {
  fetchLicense,
  updateLicense,
  showLicenseAcceptedToast,
};

export default connect<any, any, SettingsLicenseProps>(
  mapStateToProps,
  mapDispatchToProps,
)(SettingsLicense);
