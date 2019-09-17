import { Clock } from "@dtn/i18n-lib";
import * as moment from "moment-timezone";
import * as React from "react";
import { t } from "../../../i18n";

export interface Props {
  readonly when: moment.Moment;
  readonly clock?: Clock;
  readonly t: typeof t;
}
const outlookTimestamp: React.StatelessComponent<Props> = ({ when, clock, t }) => {
  return (
    <div datat-testid="outlook-timestamp">
      {t("common.outlookTimestamp")}{" "}
      {clock === Clock.TWENTY_FOUR_HOUR ? when.format("M/D HH:mm zz") : when.format("M/D h:mmA zz")}
    </div>
  );
};

export default outlookTimestamp;
