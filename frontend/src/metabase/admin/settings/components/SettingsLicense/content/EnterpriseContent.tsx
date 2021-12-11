import React from "react";
import { t, jt } from "ttag";
import ExternalLink from "metabase/components/ExternalLink";
import {
  SectionDescription,
  SectionHeader,
  SettingsLicenseContainer,
} from "../SettingsLicense.styled";
import {
  LicenseWidget,
  LicenseWidgetProps,
} from "../LicenseWidget/LicenseWidget";

type EnterpriseContentProps = LicenseWidgetProps;

export const EnterpriseContent = (props: EnterpriseContentProps) => {
  return (
    <SettingsLicenseContainer>
      <SectionHeader>{t`Billing`}</SectionHeader>

      <SectionDescription>
        {jt`To manage your billing preferences, please email ${(
          <ExternalLink href="mailto:billing@metabase.com">
            billing@metabase.com
          </ExternalLink>
        )}`}
        <LicenseWidget {...props} />
      </SectionDescription>
    </SettingsLicenseContainer>
  );
};
