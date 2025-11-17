import { Col, Button } from '@components/ui';
import styles from '../leadPageTabs.module.scss';
import { useSignatureCanvas } from './useSignatureCanvas';

export default function SignatureCanvas({ canEdit, onSignatureChange }) {
  const {
    signatureCanvasRef,
    signatureWrapperRef,
    hasSignature,
    handleSignaturePointerDown,
    handleSignaturePointerMove,
    handleSignaturePointerUp,
    clearSignature,
  } = useSignatureCanvas(onSignatureChange);

  return (
    <Col fullWidth className={styles['signature-wrapper']}>
      <div
        ref={signatureWrapperRef}
        className={`${styles['signature-area']} ${
          hasSignature ? styles['signature-area-filled'] : ''
        }`}
      >
        <canvas
          ref={signatureCanvasRef}
          className={styles['signature-canvas']}
          aria-label="Imzo chizish maydoni"
          onPointerDown={handleSignaturePointerDown}
          onPointerMove={handleSignaturePointerMove}
          onPointerUp={handleSignaturePointerUp}
          onPointerLeave={handleSignaturePointerUp}
          onPointerCancel={handleSignaturePointerUp}
        />
      </div>
      <div className={styles['signature-buttons']}>
        <Button
          variant="outlined"
          type="button"
          onClick={clearSignature}
          disabled={!canEdit || !hasSignature}
        >
          Cancel
        </Button>
      </div>
    </Col>
  );
}
