import InstructionList from '../instructions/InstructionList';
import EditControls from '../components/EditControls';
import MainGrid from '../grid/MainGrid';
import RulerOverlay from '../grid/RulerOverlay';
import { GridConsumer } from '../GridContext';
import InstructionSearch from '../instructions/InstructionSearch';
import { memo } from 'react';
import ThreePaneLayout from '../ThreePaneLayout';
import DocumentTitle from '../components/DocumentTitle';
import TouchControls from '../components/TouchControls';
import ConfigContext from '../ConfigContext';
import ConfigPopup from '../configs/ConfigPopup';
import EditorPane from './EditorPane';
import ToolboxContext from '../ToolboxContext';
import ToolboxOverlay from './ToolboxOverlay';
import { useEmbed } from '../EmbedContext';
import PuzzleChecklist from './PuzzleChecklist';

export interface PuzzleEditorProps {
  children?: React.ReactNode;
}

export default memo(function PuzzleEditor({ children }: PuzzleEditorProps) {
  const { features } = useEmbed();
  return (
    <ToolboxContext>
      <ConfigContext>
        <ThreePaneLayout
          left={
            <>
              <DocumentTitle>Puzzle Editor - Logic Pad</DocumentTitle>
              <EditorPane />
              <TouchControls />
              <EditControls />
            </>
          }
          center={
            <MainGrid useToolboxClick={true}>
              <GridConsumer>
                {({ grid }) => (
                  <RulerOverlay width={grid.width} height={grid.height} />
                )}
              </GridConsumer>
              <ToolboxOverlay />
            </MainGrid>
          }
          right={
            <>
              <div className="h-full flex flex-col items-stretch justify-center gap-4">
                {features.instructions && <InstructionSearch />}
                <InstructionList editable={features.instructions} />
                <ConfigPopup />
              </div>
              <div className="p-2 w-full flex flex-col items-stretch justify-end gap-2 shrink-0">
                <PuzzleChecklist />
                {children}
              </div>
            </>
          }
        />
      </ConfigContext>
    </ToolboxContext>
  );
});
