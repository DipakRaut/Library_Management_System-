FilePond.registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginImageResize,
  FilePondPluginFileEncode
);

FilePond.setOptions({
  stylePanelAspectRatio: 180 / 150,
  imageResizeTargetWidth: 150, // it means any image we bring it can never go beyond 150 in width
  imageResizeTargetHeight: 180,
});

FilePond.parse(document.body);
