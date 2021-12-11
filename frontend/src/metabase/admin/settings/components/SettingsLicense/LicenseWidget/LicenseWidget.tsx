import React, { useState } from "react";
import { t, jt } from "ttag";
import Button from "metabase/components/Button";
import ExternalLink from "metabase/components/ExternalLink";
import { SectionDescription, SectionHeader } from "../SettingsLicense.styled";
import {
  LicenseErrorMessage,
  LicenseInput,
  LicenseInputContainer,
} from "./LicenseWidget.styled";

const getDescription = (hasLicense: boolean, isValid?: boolean) => {
  if (!hasLicense) {
    return t`Bought a license to unlock advanced functionality? Please enter it below.`;
  }

  if (!isValid) {
    return (
      <>
        {jt`Your license isn’t valid anymore. If you have a new license, please
        enter it below, otherwise please contact ${(
          <ExternalLink href="mailto:support@metabase.com">
            support@metabase.com
          </ExternalLink>
        )}`}
      </>
    );
  }

  return t`Your license is active! Hope you’re enjoying it.`;
};

export interface LicenseWidgetProps {
  currentLicense?: string;
  isValid?: boolean;
  error?: string;
  onUpdate: (license: string) => void;
}

export const LicenseWidget = ({
  currentLicense,
  isValid,
  error,
  onUpdate,
}: LicenseWidgetProps) => {
  const [value, setValue] = useState(currentLicense ?? "");

  const handleChange = (value: string) => setValue(value);

  const handleActivate = () => {
    onUpdate(value);
  };

  return (
    <>
      <SectionHeader>License</SectionHeader>

      <>
        <SectionDescription>
          {getDescription(!!currentLicense, isValid)}
        </SectionDescription>

        <LicenseInputContainer>
          <LicenseInput
            disabled={isValid}
            onChange={handleChange}
            value={value}
            placeholder={"XXXX-XXXX-XXXX-XXXX-XXXX-XXXX-XXXX"}
          />
          {!isValid && (
            <Button
              disabled={value.length === 0}
              className="px2"
              onClick={handleActivate}
            >
              Activate
            </Button>
          )}
        </LicenseInputContainer>
      </>
      {error && <LicenseErrorMessage>{error}</LicenseErrorMessage>}
    </>
  );
};
