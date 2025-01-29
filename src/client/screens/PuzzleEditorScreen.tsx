import InstructionList from '../instructions/InstructionList';
import EditControls from '../components/EditControls';
import MainGrid from '../grid/MainGrid';
import RulerOverlay from '../grid/RulerOverlay';
import { GridConsumer } from '../contexts/GridContext';
import InstructionSearch from '../instructions/InstructionSearch';
import { memo } from 'react';
import ThreePaneLayout from '../components/ThreePaneLayout';
import DocumentTitle from '../components/DocumentTitle';
import TouchControls from '../components/TouchControls';
import ConfigContext from '../contexts/ConfigContext';
import ConfigPopup from '../configs/ConfigPopup';
import EditorPane from '../editor/EditorPane';
import ToolboxContext from '../contexts/ToolboxContext';
import ToolboxOverlay from '../editor/ToolboxOverlay';
import { useEmbed } from '../contexts/EmbedContext';
import PuzzleChecklist from '../editor/PuzzleChecklist';
import InstructionPartOutlet from '../instructions/InstructionPartOutlet';
import { PartPlacement } from '../instructions/parts/types';
import ModeVariantLoader from '../router/ModeVariantLoader';
import { Mode } from '@logic-pad/core/data/primitives';

export interface PuzzleEditorScreenProps {
  children?: React.ReactNode;
}

export default memo(function PuzzleEditorScreen({
  children,
}: PuzzleEditorScreenProps) {
  const { features } = useEmbed();
  return (
    <ToolboxContext>
      <ConfigContext>
        <ThreePaneLayout
          left={
            <>
              <DocumentTitle>Puzzle Editor - Logic Pad</DocumentTitle>
              <EditorPane />
              <div className="shrink-0 flex-col gap-1 hidden has-[*]:flex">
                <GridConsumer>
                  {({ grid }) => (
                    <InstructionPartOutlet
                      grid={grid}
                      placement={PartPlacement.LeftPanel}
                    />
                  )}
                </GridConsumer>
                <GridConsumer>
                  {({ grid }) => (
                    <InstructionPartOutlet
                      grid={grid}
                      placement={PartPlacement.LeftBottom}
                    />
                  )}
                </GridConsumer>
              </div>
              <TouchControls />
              <EditControls />
              <ModeVariantLoader mode={Mode.Create} />
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
                <ConfigPopup key="config-popup" />
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
