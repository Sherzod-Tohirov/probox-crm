import { Col, Row, Table } from '@components/ui';
import LeadsToolbar from '@features/leads/components/LeadsToolbar';
import LeadsFilter from '@features/leads/components/Filter';
import AdvancedFilterModal from '@features/leads/components/Filter/AdvancedFilterModal';
import AddLeadModal from '@/features/leads/components/modals/AddLeadModal';
import LeadsPageFooter from '@features/leads/components/LeadsPageFooter';
import useLeadsPageController from '@features/leads/hooks/useLeadsPageController';

export default function Leads() {
  const {
    isMobile,
    user,
    role,
    leads,
    meta,
    filter,
    isLoadingLeads,
    leadsTableColumns,
    columnsToUse,
    leadsTableRef,
    tableDensityClass,
    rowNumberOffset,
    getRowStyles,
    handleFilter,
    handleRowClick,
    handleAddLeadCreated,
    isAdvancedOpen,
    openAdvancedModal,
    closeAdvancedModal,
    isAddOpen,
    openAddModal,
    closeAddModal,
    visibleColumns,
    setVisibleColumns,
    uiScale,
    increaseScale,
    decreaseScale,
    resetScale,
    canIncrease,
    canDecrease,
    isDefaultUI,
    increaseDensity,
    decreaseDensity,
    resetDensity,
    isMinDensity,
    isMaxDensity,
    isDefaultDensity,
  } = useLeadsPageController();

  return (
    <>
      <Row gutter={isMobile ? 2 : 6} style={{ width: '100%', height: '100%' }}>
        <Col fullWidth>
          <Row gutter={isMobile ? 4 : 6}>
            <Col fullWidth>
              <LeadsToolbar
                user={user}
                uiScale={uiScale}
                onIncreaseUIScale={increaseScale}
                onDecreaseUIScale={decreaseScale}
                onResetUIScale={resetScale}
                onIncreaseDensity={increaseDensity}
                onDecreaseDensity={decreaseDensity}
                onResetDensity={resetDensity}
                onToggleFilter={openAdvancedModal}
                onAddLead={openAddModal}
                isMobile={isMobile}
                canIncreaseUI={canIncrease}
                canDecreaseUI={canDecrease}
                isDefaultUI={isDefaultUI}
                isMinDensity={isMinDensity}
                isMaxDensity={isMaxDensity}
                isDefaultDensity={isDefaultDensity}
              />
            </Col>
            <Col fullWidth>
              <LeadsFilter onFilter={handleFilter} isExpanded={false} minimal />
            </Col>
          </Row>
        </Col>
        <Col fullWidth flexGrow fullHeight>
          <Table
            id="leads-table"
            scrollable={{ xs: true, sm: true, md: true, lg: true, xl: true }}
            ref={leadsTableRef}
            uniqueKey="id"
            isLoading={isLoadingLeads}
            columns={columnsToUse}
            data={leads}
            onRowClick={handleRowClick}
            containerClass={tableDensityClass}
            rowNumberOffset={rowNumberOffset}
            getRowStyles={getRowStyles}
          />
        </Col>
      </Row>
      <AddLeadModal
        isOpen={isAddOpen}
        onClose={closeAddModal}
        onCreated={handleAddLeadCreated}
      />
      <AdvancedFilterModal
        isOpen={isAdvancedOpen}
        onClose={closeAdvancedModal}
        onApply={handleFilter}
        initialValues={filter}
        role={role}
        columns={leadsTableColumns}
        visibleColumns={visibleColumns}
        onChangeVisibleColumns={setVisibleColumns}
      />
      <LeadsPageFooter leadsDetails={meta} />
    </>
  );
}
