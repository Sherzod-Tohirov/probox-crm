import { Row, Col, Input } from '@components/ui';
import SelectField from '../fields/SelectField';
import { meetingOptions } from '../options';
import styles from '../style.module.scss';
import moment from 'moment';

export default function MeetingAndDateSection({
  control,
  isMobile,
  watchedMeeting,
  watchedMeetingDateStart,
  watchedMeetingDateEnd,
}) {
  console.log(watchedMeeting, 'watchedMeeting');
  return (
    <Row direction="row" gutter={isMobile ? 2 : 1} wrap align="flex-end">
      <Col
        xs={12}
        sm={6}
        md={2}
        lg={1.5}
        xl={1.3}
        className={isMobile ? styles['mobile-full-width'] : styles.compactCol}
      >
        <SelectField
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
          name="meetingDateStart"
          size="full-grow"
          variant="outlined"
          label="Boshlanish"
          canClickIcon={false}
          type="date"
          disabled={watchedMeeting === ''}
          datePickerOptions={{
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
          name="meetingDateEnd"
          size="full-grow"
          variant="outlined"
          label="Tugash"
          canClickIcon={false}
          type="date"
          disabled={watchedMeeting === ''}
          datePickerOptions={{
            minDate: watchedMeetingDateStart
              ? moment(watchedMeetingDateStart, 'DD.MM.YYYY').toDate()
              : undefined,
          }}
          control={control}
        />
      </Col>
    </Row>
  );
}
