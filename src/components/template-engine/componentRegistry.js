import NoteComponent from './NoteComponent.jsx';
import PlateColorizerBlock from './PlateColorizerBlock.jsx';
import PlateViewerComponent from './PlateViewerComponent.jsx';
import ReactionTableComponent from './ReactionTableComponent.jsx';

export const COMPONENT_REGISTRY = {
  note: NoteComponent,
  plate_colorizer: PlateColorizerBlock,
  reaction_table: ReactionTableComponent,
  plate_viewer: PlateViewerComponent,
};
