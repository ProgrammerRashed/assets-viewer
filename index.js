const folderPath = './assets/'; // Path to the assets folder

async function fetchAssets() {
  try {
    const response = await fetch(folderPath);
    if (!response.ok) throw new Error('Cannot access folder');

    const assetFiles = await response.text();
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(assetFiles, 'text/html');
    const links = htmlDoc.querySelectorAll('a');
    const assetList = document.getElementById('asset-list');

    for (const link of links) {
      const fileName = link.href.split('/').pop();
      const filePath = folderPath + fileName;

      if (/\.(jpe?g|png|gif|webp)$/i.test(fileName)) {
        const img = new Image();
        img.src = filePath;

        // Fetch the image to get its size
        const fileResponse = await fetch(filePath);
        const blob = await fileResponse.blob();

        img.onload = function () {
          const assetDiv = document.createElement('div');
          assetDiv.className = 'asset';

          const previewDiv = document.createElement('div');
          previewDiv.className = 'preview';
          const imgElement = document.createElement('img');
          imgElement.src = filePath;
          previewDiv.appendChild(imgElement);

          const detailsDiv = document.createElement('div');
          detailsDiv.className = 'details';

          const fileDetails = `
            <p><strong>Name:</strong> ${fileName}</p>
            <p><strong>Size:</strong> ${(blob.size / 1024).toFixed(2)} KB</p>
            <p><strong>Extension:</strong> ${fileName.split('.').pop()}</p>
            <p><strong>Dimensions:</strong> ${img.width}x${img.height}</p>
          `;

          detailsDiv.innerHTML = fileDetails;

          assetDiv.appendChild(previewDiv);
          assetDiv.appendChild(detailsDiv);
          assetList.appendChild(assetDiv);
        };
      }
    }
  } catch (error) {
    console.error('Error fetching assets:', error);
  }
}

fetchAssets();
