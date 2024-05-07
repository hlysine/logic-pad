import { memo } from 'react';

export interface AccordionProps {
  title: React.ReactNode;
  children: React.ReactNode;
}

export default memo(function Accordion({ title, children }: AccordionProps) {
  return (
    <div className="collapse collapse-arrow shrink-0 bg-base-100 overflow-visible">
      <input
        type="checkbox"
        name="gui-editor-accordion"
        defaultChecked={true}
      />
      <div className="collapse-title font-medium">{title}</div>
      <div className="collapse-content">{children}</div>
    </div>
  );
});
