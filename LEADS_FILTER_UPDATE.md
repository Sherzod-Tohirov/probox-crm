# Leads Filter Enhancement Documentation

## Summary
Added comprehensive filtering capabilities to the Leads page with branch, operator selections, and meeting date range filters.

## Changes Made

### 1. **New Filter Fields Added**

| Field | Type | Description |
|-------|------|-------------|
| `branch` | Multi-select | Branch/Filial selection from `/branches` API |
| `operator` | Multi-select | Operator1 role users with avatars |
| `operator2` | Multi-select | Operator2 role users with avatars |
| `meetingDateStart` | Date picker | Meeting start date (DD.MM.YYYY format) |
| `meetingDateEnd` | Date picker | Meeting end date (DD.MM.YYYY format) |

### 2. **Files Created**

#### `src/services/branchesService.js`
- Service to fetch branches from `/branches` API endpoint
- Uses the standard `fetchData` utility

#### `src/hooks/data/useFetchBranches.jsx`
- React Query hook to fetch and cache branches data
- Follows the same pattern as `useFetchExecutors`

### 3. **Files Modified**

#### `src/utils/store/initialStates.js`
- Updated `initialLeadsFilterState` with new filter fields
- Meeting dates default to current month (start/end)

**Before:**
```javascript
export const initialLeadsFilterState = {
  search: '',
  source: '',
};
```

**After:**
```javascript
export const initialLeadsFilterState = {
  search: '',
  source: '',
  branch: '',
  operator: '',
  operator2: '',
  meetingDateStart: today,
  meetingDateEnd: endOfMonth,
};
```

#### `src/features/leads/components/Filter/index.jsx`
- Added imports: `moment`, `useFetchBranches`, `useFetchExecutors`, `selectOptionsCreator`
- Fetches branches data via new hook
- Fetches operators with `allowed_role: 'Operator1'` parameter
- Fetches operators with `allowed_role: 'Operator2'` parameter
- Creates select options for each data source
- Added 5 new filter input fields in the form

## Implementation Details

### Branch Filter
```javascript
<Input
  size="full-grow"
  variant="outlined"
  label="Filial"
  type="select"
  options={branchOptions}
  canClickIcon={false}
  multipleSelect={true}
  isLoading={isBranchesLoading}
  control={control}
  {...register('branch')}
/>
```

**Expected API Response Format:**
```javascript
[
  { BPLId: 1, BPLName: "Branch 1" },
  { BPLId: 2, BPLName: "Branch 2" }
]
```

### Operator Filters
Both operator filters use the executors API with role filtering:

**Operator 1:**
```javascript
useFetchExecutors({ allowed_role: 'Operator1' })
```

**Operator 2:**
```javascript
useFetchExecutors({ allowed_role: 'Operator2' })
```

**Expected API Response Format:**
```javascript
[
  { SlpCode: 1, SlpName: "John Doe" },
  { SlpCode: 2, SlpName: "Jane Smith" }
]
```

Both include avatar display with `showAvatars={true}` and `avatarSize={22}`.

### Meeting Date Filters
Implemented with date range validation (same pattern as clients page):

- **Start Date**: Cannot be after end date
- **End Date**: Cannot be before start date
- **Format**: DD.MM.YYYY (via moment.js)
- **Default**: Current month start/end dates

```javascript
// Start date constraint
datePickerOptions={{
  maxDate: watchedMeetingDateEnd
    ? moment(watchedMeetingDateEnd, 'DD.MM.YYYY').toDate()
    : undefined,
}}

// End date constraint
datePickerOptions={{
  minDate: watchedMeetingDateStart
    ? moment(watchedMeetingDateStart, 'DD.MM.YYYY').toDate()
    : undefined,
}}
```

## API Requirements

### New Endpoint: `/branches`
**Method:** GET  
**Expected Response:**
```json
{
  "data": [
    {
      "BPLId": 1,
      "BPLName": "Main Branch"
    },
    {
      "BPLId": 2,
      "BPLName": "Secondary Branch"
    }
  ]
}
```

### Updated Endpoint: `/executors`
**Method:** GET  
**New Query Parameters:**
- `allowed_role`: Filter executors by specific role (e.g., "Operator1", "Operator2")

**Example Requests:**
- `/executors?allowed_role=Operator1`
- `/executors?allowed_role=Operator2`

**Expected Response:**
```json
{
  "data": [
    {
      "SlpCode": 1,
      "SlpName": "Operator Name"
    }
  ]
}
```

## Filter Behavior

### Form Submission
All filter values are collected and dispatched to Redux store:
```javascript
{
  search: "search text",
  source: "Instagram",
  branch: "1,2,3",        // Comma-separated IDs for multi-select
  operator: "1,2",         // Comma-separated IDs for multi-select
  operator2: "3,4",        // Comma-separated IDs for multi-select
  meetingDateStart: "01.10.2024",
  meetingDateEnd: "31.10.2024"
}
```

### Clear Filter
Resets all fields to `initialLeadsFilterState` including:
- Empty strings for text/select fields
- Current month start/end for dates

## Testing Checklist

- [ ] Branches API endpoint `/branches` returns correct data
- [ ] Branches multi-select displays and filters correctly
- [ ] Executors API accepts `allowed_role=Operator1` parameter
- [ ] Executors API accepts `allowed_role=Operator2` parameter
- [ ] Operator1 multi-select shows only Operator1 role users
- [ ] Operator2 multi-select shows only Operator2 role users
- [ ] Operator avatars display correctly
- [ ] Meeting date start picker constrains max date
- [ ] Meeting date end picker constrains min date
- [ ] Date format displays as DD.MM.YYYY
- [ ] Filter submission includes all fields
- [ ] Clear filter resets all fields to initial state
- [ ] Multi-select values are properly serialized (comma-separated)

## UI Layout

The filters now appear in this order:
1. **Qidiruv** (Search) - Text input
2. **Manba** (Source) - Single select dropdown
3. **Filial** (Branch) - Multi-select dropdown
4. **Operator 1** - Multi-select dropdown with avatars
5. **Operator 2** - Multi-select dropdown with avatars
6. **Uchrashuv bosh. vaqti** (Meeting start date) - Date picker
7. **Uchrashuv tug. vaqti** (Meeting end date) - Date picker

All filters are responsive and follow the existing design pattern from the clients page.
