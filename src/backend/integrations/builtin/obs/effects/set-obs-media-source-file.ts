import { EffectType } from "../../../../../types/effects";
import { OBSSource, setMediaSourceSettings } from "../obs-remote";

export const SetOBSMediaSourceFileEffectType: EffectType<{
  mediaSourceName: string;
  file: string;
}> = {
  definition: {
    id: "firebot:obs-set-media-source-file",
    name: "Set OBS Media Source File",
    description: "Sets the file of an OBS media source",
    icon: "fad fa-film",
    categories: ["common"],
  },
  optionsTemplate: `
    <eos-container header="OBS Media Source">
        <ui-select ng-model="selected" on-select="selectMediaSource($select.selected.name)">
          <ui-select-match placeholder="Select a Media Source...">{{$select.selected.name}}</ui-select-match>
          <ui-select-choices repeat="source in mediaSources | filter: {name: $select.search}">
            <div ng-bind-html="source.name | highlight: $select.search"></div>
          </ui-select-choices>
          <ui-select-no-choice>
          <b>No media sources found.</b>
          </ui-select-no-choice>
        </ui-select>
        <div ng-if="mediaSources == null" class="muted">
            No sources found. Is OBS running?
        </div>
        <p>
            <button class="btn btn-link" ng-click="getMediaSources()">Refresh Source Data</button>
        </p>
    </eos-container>

    <eos-container ng-if="mediaSources != null && effect.mediaSourceName != null" header="File" style="margin-top: 10px;">
      <file-chooser model="effect.file" options="{ filters: [ {name: 'OBS-Supported Video Files', extensions: ['mp4', 'm4v', 'ts', 'mov', 'mxf', 'flv', 'mkv', 'avi', 'gif', 'webm']}, {name: 'OBS-Supported Audio Files', extensions: ['mp3', 'aac', 'ogg', 'wav']}, {name: 'All Files', extensions: ['*']} ]}"></file-chooser>
    </eos-container>
  `,
  optionsController: ($scope: any, backendCommunicator: any, $q: any) => {
    $scope.mediaSources = [];

    $scope.selectMediaSource = (mediaSourceName: string) => {
      $scope.effect.mediaSourceName = mediaSourceName;
    };

    $scope.getMediaSources = () => {
      $q.when(
        backendCommunicator.fireEventAsync("obs-get-media-sources")
      ).then((mediaSources: OBSSource[]) => {
        $scope.mediaSources = mediaSources ?? [];
        $scope.selected = $scope.mediaSources.find(source => source.name === $scope.effect.mediaSourceName);
      });
    };
    $scope.getMediaSources();
  },
  optionsValidator: (effect) => {
    const errors: string[] = [];

    if (effect.mediaSourceName == null) {
      errors.push("Please select a media source");
    } else if (!(effect.file?.length > 0)) {
      errors.push("Please select or enter a filename");
    }

    return errors;
  },
  onTriggerEvent: async ({ effect }) => {
    await setMediaSourceSettings(effect.mediaSourceName, {
      isLocalFile: true,
      localFile: effect.file
    });
    return true;
  },
};
