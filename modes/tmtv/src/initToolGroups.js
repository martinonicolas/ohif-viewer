export const toolGroupIds = {
  CT: 'ctToolGroup',
  PT: 'ptToolGroup',
  Fusion: 'fusionToolGroup',
  MIP: 'mipToolGroup',
  default: 'default',
};

const colours = {
  'viewport-0': 'rgb(200, 0, 0)',
  'viewport-1': 'rgb(200, 200, 0)',
  'viewport-2': 'rgb(0, 200, 0)',
};

const colorsByOrientation = {
  axial: 'rgb(200, 0, 0)',
  sagittal: 'rgb(200, 200, 0)',
  coronal: 'rgb(0, 200, 0)',
};

function _initToolGroups(toolNames, Enums, toolGroupService, commandsManager, modeLabelConfig, servicesManager) {

  const { cornerstoneViewportService } = servicesManager.services;

  const tools = {
    active: [
      {
        toolName: toolNames.WindowLevel,
        bindings: [{ mouseButton: Enums.MouseBindings.Primary }],
      },
      {
        toolName: toolNames.Pan,
        bindings: [{ mouseButton: Enums.MouseBindings.Auxiliary }],
      },
      {
        toolName: toolNames.Zoom,
        bindings: [{ mouseButton: Enums.MouseBindings.Secondary }],
      },
      { toolName: toolNames.StackScrollMouseWheel, bindings: [] },
    ],
    passive: [
      { toolName: toolNames.Length },
      {
        toolName: toolNames.ArrowAnnotate,
        configuration: {
          getTextCallback: (callback, eventDetails) => {
            if (modeLabelConfig) {
              callback(' ');
            } else {
              commandsManager.runCommand('arrowTextCallback', {
                callback,
                eventDetails,
              });
            }
          },
          changeTextCallback: (data, eventDetails, callback) => {
            if (modeLabelConfig === undefined) {
              commandsManager.runCommand('arrowTextCallback', {
                callback,
                data,
                eventDetails,
              });
            }
          },
        },
      },
      { toolName: toolNames.Bidirectional },
      { toolName: toolNames.DragProbe },
      { toolName: toolNames.Probe },
      { toolName: toolNames.EllipticalROI },
      { toolName: toolNames.RectangleROI },
      { toolName: toolNames.StackScroll },
      { toolName: toolNames.Angle },
      { toolName: toolNames.CobbAngle },
      { toolName: toolNames.Magnify },
      {
        toolName: 'CircularBrush',
        parentTool: 'Brush',
        configuration: {
          activeStrategy: 'FILL_INSIDE_CIRCLE',
        },
      },
      {
        toolName: 'CircularEraser',
        parentTool: 'Brush',
        configuration: {
          activeStrategy: 'ERASE_INSIDE_CIRCLE',
        },
      },
      {
        toolName: 'SphereBrush',
        parentTool: 'Brush',
        configuration: {
          activeStrategy: 'FILL_INSIDE_SPHERE',
        },
      },
      {
        toolName: 'SphereEraser',
        parentTool: 'Brush',
        configuration: {
          activeStrategy: 'ERASE_INSIDE_SPHERE',
        },
      },
      {
        toolName: 'ThresholdCircularBrush',
        parentTool: 'Brush',
        configuration: {
          activeStrategy: 'THRESHOLD_INSIDE_CIRCLE',
        },
      },
      {
        toolName: 'ThresholdSphereBrush',
        parentTool: 'Brush',
        configuration: {
          activeStrategy: 'THRESHOLD_INSIDE_SPHERE',
        },
      },
      {
        toolName: 'ThresholdCircularBrushDynamic',
        parentTool: 'Brush',
        configuration: {
          activeStrategy: 'THRESHOLD_INSIDE_CIRCLE',
          // preview: {
          //   enabled: true,
          // },
          strategySpecificConfiguration: {
            // to use the use the center segment index to determine
            // if inside -> same segment, if outside -> eraser
            // useCenterSegmentIndex: true,
            THRESHOLD: {
              isDynamic: true,
              dynamicRadius: 3,
            },
          },
        },
      },
    ],
    enabled: [{ toolName: toolNames.SegmentationDisplay }],
    disabled: [
      {
        toolName: toolNames.Crosshairs,
        configuration: {
          viewportIndicators: true,
          disableOnPassive: true,
          autoPan: {
            enabled: false,
            panSize: 10,
          },
          getReferenceLineColor: viewportId => {
            const viewportInfo = cornerstoneViewportService.getViewportInfo(viewportId);
            const viewportOptions = viewportInfo?.viewportOptions;
            if (viewportOptions) {
              return (
                colours[viewportOptions.id] ||
                colorsByOrientation[viewportOptions.orientation] ||
                '#0c0'
              );
            } else {
              console.warn('missing viewport?', viewportId);
              return '#0c0';
            }
          },
        },
      },
    ],
  };

  toolGroupService.createToolGroupAndAddTools(toolGroupIds.CT, tools);
  toolGroupService.createToolGroupAndAddTools(toolGroupIds.PT, {
    active: tools.active,
    passive: [...tools.passive, { toolName: 'RectangleROIStartEndThreshold' }],
    enabled: tools.enabled,
    disabled: tools.disabled,
  });
  toolGroupService.createToolGroupAndAddTools(toolGroupIds.Fusion, tools);
  toolGroupService.createToolGroupAndAddTools(toolGroupIds.default, tools);

  const mipTools = {
    active: [
      {
        toolName: toolNames.VolumeRotateMouseWheel,
        configuration: {
          rotateIncrementDegrees: 5,
        },
      },
      {
        toolName: toolNames.MipJumpToClick,
        configuration: {
          toolGroupId: toolGroupIds.PT,
        },
        bindings: [{ mouseButton: Enums.MouseBindings.Primary }],
      },
    ],
    enabled: [
      { toolName: toolNames.SegmentationDisplay },
      {
        toolName: toolNames.OrientationMarker,
        configuration: {
          orientationWidget: {
            viewportCorner: 'BOTTOM_LEFT',
          },
        },
      },
    ],
  };

  toolGroupService.createToolGroupAndAddTools(toolGroupIds.MIP, mipTools);
}

function initToolGroups(toolNames, Enums, toolGroupService, commandsManager, modeLabelConfig, servicesManager) {
  _initToolGroups(toolNames, Enums, toolGroupService, commandsManager, modeLabelConfig, servicesManager);
}

export default initToolGroups;
