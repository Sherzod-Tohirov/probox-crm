import { Col, Input } from '@components/ui';
import SelectField from '../fields/SelectField';
import { meetingOptions } from '../../../utils/options';
import styles from '../style.module.scss';
import moment from 'moment';

export default function MeetingAndDateSection({
  control,
  isMobile,
  watchedMeeting,
  watchedMeetingDateStart,
  watchedMeetingDateEnd,
  dateInputKey = 0,
  inline = false,
}) {
  const content = (
    <>
      <Col
        xs={12}
        sm={6}
        md={2}
        lg={1.5}
        xl={1.3}
        className={isMobile ? styles['mobile-full-width'] : styles.compactCol}
      >
        <SelectField
          key={`meeting-${dateInputKey}`}
          name="meeting"
          label="Uchrashuv"
          options={meetingOptions}
          control={control}
        />
      </Col>

      <Col
        xs={12}
        sm={6}
        md={2}
        lg={1.5}
        xl={1.3}
        className={isMobile ? styles['mobile-full-width'] : styles.compactCol}
      >
        <Input
          key={`meetingDateStart-${dateInputKey}`}
          name="meetingDateStart"
          size="full-grow"
          variant="outlined"
          label="Boshlanish"
          canClickIcon={false}
          type="date"
          disabled={!watchedMeeting}
          datePickerOptions={{
            clickOpens: watchedMeeting !== '',
            maxDate: watchedMeetingDateEnd
              ? moment(watchedMeetingDateEnd, 'DD.MM.YYYY').toDate()
              : undefined,
          }}
          control={control}
        />
      </Col>

      <Col
        xs={12}
        sm={6}
        md={2}
        lg={1.5}
        xl={1.3}
        className={isMobile ? styles['mobile-full-width'] : styles.compactCol}
      >
        <Input
          key={`meetingDateEnd-${dateInputKey}`}
          name="meetingDateEnd"
          size="full-grow"
          variant="outlined"
          label="Tugash"
          canClickIcon={false}
          type="date"
          disabled={!watchedMeeting}
          datePickerOptions={{
            clickOpens: watchedMeeting !== '',
            minDate: watchedMeetingDateStart
              ? moment(watchedMeetingDateStart, 'DD.MM.YYYY').toDate()
              : undefined,
          }}
          control={control}
        />
      </Col>
    </>
  );

  if (inline) return <>{content}</>;

  return <div className={styles.gridRow}>{content}</div>;
}
