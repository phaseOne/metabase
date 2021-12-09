import React from "react";
import { t } from "ttag";
import LogoIcon from "metabase/components/LogoIcon";
import {
  StepRoot,
  StepMain,
  StepTitle,
  StepBody,
  StepButton,
} from "./WelcomeStep.styled";

const WelcomeStep = () => {
  return (
    <StepRoot>
      <StepMain>
        <LogoIcon height={118} />
        <StepTitle>{t`Welcome to Metabase`}</StepTitle>
        <StepBody>
          {t`Looks like everything is working. Now let’s get to know you, connect to your data, and start finding you some answers!`}
        </StepBody>
        <StepButton primary>{t`Let's get started`}</StepButton>
      </StepMain>
    </StepRoot>
  );
};

export default WelcomeStep;
