import React from "react";
import { t } from "ttag";
import ExternalLink from "metabase/components/ExternalLink";
import MetabaseSettings from "metabase/lib/settings";
import {
  SectionDescription,
  SectionHeader,
  SettingsLicenseContainer,
} from "../SettingsLicense.styled";
import { LicenseWidget, LicenseWidgetProps } from "../LicenseWidget";

type ProContentProps = LicenseWidgetProps;

export const ProContent = (props: ProContentProps) => {
  return (
    <SettingsLicenseContainer>
      <SectionHeader>Billing</SectionHeader>

      <SectionDescription>
        {t`Manage your Cloud account, including billing preferences, in your Metabase Store account.`}
      </SectionDescription>

      <ExternalLink
        href={MetabaseSettings.storeUrl()}
        className="Button Button--primary"
      >
        {t`Go to the Metabase Store`}
      </ExternalLink>

      <LicenseWidget {...props} />
    </SettingsLicenseContainer>
  );
};
