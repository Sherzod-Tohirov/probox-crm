# Optional Meeting Date Filters - Implementation

## Summary
Implemented a toggle to make meeting date filters optional in the Leads filter. When disabled, date values are not sent to the API.

## Changes Made

### 1. **Updated Initial State**
**File:** `src/utils/store/initialStates.js`

- Changed `meetingDateStart` and `meetingDateEnd` from current month dates to empty strings
- Added `enableMeetingDateFilter: false` toggle flag

**Before:**
```javascript
export const initialLeadsFilterState = {
  search: '',
  source: '',
  branch: [],
  operator: [],
  operator2: [],
  meetingDateStart: today,
  meetingDateEnd: endOfMonth,
};
```

**After:**
```javascript
export const initialLeadsFilterState = {
  search: '',
  source: '',
  branch: [],
  operator: [],
  operator2: [],
  meetingDateStart: '',
  meetingDateEnd: '',
  enableMeetingDateFilter: false, // Toggle to enable/disable date filtering
};
```

### 2. **Added Toggle to Filter Component**
**File:** `src/features/leads/components/Filter/index.jsx`

#### A. Added Checkbox Toggle
A checkbox is displayed before the date inputs that controls whether date filtering is enabled:

```jsx
<Col flexGrow style={{ display: 'flex', alignItems: 'flex-end' }}>
  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', cursor: 'pointer' }}>
    <input
      type="checkbox"
      {...register('enableMeetingDateFilter')}
      style={{ cursor: 'pointer', width: '18px', height: '18px' }}
    />
    <span style={{ fontSize: '14px', fontWeight: '500' }}>Uchrashuv sanasi bo'yicha</span>
  </label>
</Col>
```

#### B. Date Inputs Are Disabled When Toggle Is Off
Both date inputs have `disabled={!enableMeetingDateFilter}`:

```jsx
<Input
  size="full-grow"
  variant="outlined"
  label="Uchrashuv bosh. vaqti"
  disabled={!enableMeetingDateFilter} // Disabled when toggle is off
  type="date"
  // ...
/>
```

#### C. Auto-populate Dates When Toggle Is Enabled
When the user checks the toggle, dates are automatically set to the current month if empty:

```javascript
useEffect(() => {
  if (enableMeetingDateFilter) {
    // If dates are empty when enabling, set to current month
    if (!watchedMeetingDateStart) {
      setValue('meetingDateStart', moment().startOf('month').format('DD.MM.YYYY'));
    }
    if (!watchedMeetingDateEnd) {
      setValue('meetingDateEnd', moment().endOf('month').format('DD.MM.YYYY'));
    }
  }
}, [enableMeetingDateFilter, watchedMeetingDateStart, watchedMeetingDateEnd, setValue]);
```

#### D. Exclude Dates from API When Toggle Is Off
The `onSubmit` function removes date fields from the payload when the toggle is disabled:

```javascript
const onSubmit = useCallback(
  (data) => {
    const payload = { ...data };
    
    // Remove date fields if date filter is disabled
    if (!data.enableMeetingDateFilter) {
      delete payload.meetingDateStart;
      delete payload.meetingDateEnd;
    }
    
    dispatch(setLeadsCurrentPage(0));
    dispatch(setLeadsFilter(payload));
    onFilter(payload);
  },
  [dispatch, onFilter]
);
```

## How It Works

### Initial State (Toggle OFF)
- Checkbox is unchecked
- Date inputs are **disabled** (greyed out)
- Dates are **not sent** to the API when filtering

### When User Enables Toggle (Toggle ON)
1. User checks the "Uchrashuv sanasi bo'yicha" checkbox
2. Date inputs become **enabled**
3. Dates auto-populate to current month (start/end) if empty
4. User can select custom date range
5. Dates **are sent** to the API when filtering

### When User Disables Toggle (Toggle OFF again)
1. User unchecks the checkbox
2. Date inputs become **disabled** again
3. Dates **are not sent** to the API even if they have values

## UI Behavior

### Filter Layout
The toggle appears as a checkbox before the date inputs:

```
[ ] Uchrashuv sanasi bo'yicha    [Bosh. vaqti]    [Tug. vaqti]
```

### Visual States
- **Unchecked**: Date inputs are disabled (greyed out, not clickable)
- **Checked**: Date inputs are enabled and functional

## API Payload Examples

### With Toggle OFF
```javascript
{
  search: "test",
  source: "Instagram",
  branch: [1, 2],
  operator: [3],
  operator2: [4],
  enableMeetingDateFilter: false
  // meetingDateStart and meetingDateEnd are NOT included
}
```

### With Toggle ON
```javascript
{
  search: "test",
  source: "Instagram",
  branch: [1, 2],
  operator: [3],
  operator2: [4],
  enableMeetingDateFilter: true,
  meetingDateStart: "01.10.2024",
  meetingDateEnd: "31.10.2024"
}
```

## Benefits

1. ✅ **Optional Filtering**: Users can search without date constraints
2. ✅ **Clear Intent**: Toggle explicitly shows if date filtering is active
3. ✅ **Better Performance**: Doesn't send unnecessary date parameters to API
4. ✅ **User-Friendly**: Disabled inputs clearly indicate they're not being used
5. ✅ **Auto-Population**: Convenient default dates when enabling

## Testing Checklist

- [ ] Toggle defaults to unchecked/OFF
- [ ] Date inputs are disabled when toggle is OFF
- [ ] Date inputs enable when toggle is checked
- [ ] Dates auto-populate to current month when toggle is enabled with empty dates
- [ ] Filter submission excludes dates when toggle is OFF
- [ ] Filter submission includes dates when toggle is ON
- [ ] Clear filter resets toggle to OFF
- [ ] Date validation still works (start ≤ end) when enabled
- [ ] User can manually change dates after auto-population
