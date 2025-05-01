document.addEventListener('DOMContentLoaded', () => {
  const bossesDiv = document.getElementById('bosses');
  const counter = document.getElementById('boss-counter');

  // Function to update the counter
  function updateCounter() {
    const total = document.querySelectorAll('.boss-item input[type="checkbox"]').length;
    const checked = document.querySelectorAll('.boss-item input[type="checkbox"]:checked').length;
    counter.textContent = `Bosses killed: ${checked} / ${total}`;
  }

  // Fetch and load the boss data
  fetch('./data/boss_list.json')
    .then(response => response.json())
    .then(bossData => {
      bossData.forEach(region => {
        const regionDiv = document.createElement('div');
        regionDiv.classList.add('region');

        const regionName = document.createElement('div');
        regionName.classList.add('region-name');
        regionName.textContent = region.location;
        regionDiv.appendChild(regionName);

        const bossListDiv = document.createElement('div');
        bossListDiv.classList.add('boss-list');

        region.bosses.forEach(boss => {
          const bossItemDiv = document.createElement('div');
          bossItemDiv.classList.add('boss-item');

          // Ensure the checkbox has a valid and unique ID by combining region + boss name
          const safeId = `${region.location}_${boss}`.replace(/\W+/g, '_');

          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.id = safeId;
          checkbox.dataset.location = region.location;

          const label = document.createElement('label');
          label.setAttribute('for', safeId);
          label.textContent = boss;

          bossItemDiv.appendChild(checkbox);
          bossItemDiv.appendChild(label);
          bossListDiv.appendChild(bossItemDiv);
        });

        regionDiv.appendChild(bossListDiv);
        bossesDiv.appendChild(regionDiv);

        // Toggle the display of the boss list when region name is clicked
        regionName.addEventListener('click', () => {
          bossListDiv.style.display = bossListDiv.style.display === 'block' ? 'none' : 'block';
        });
      });

      // Call the updateCounter function after everything is loaded
      updateCounter();
    })
    .catch(error => {
      console.error('Error loading the boss data:', error);
    });

  // Event listeners for window controls
  document.getElementById('minimize').addEventListener('click', () => {
    window.ipcRenderer.send('minimize-window');
  });

  document.getElementById('maximize').addEventListener('click', () => {
    window.ipcRenderer.send('maximize-window');
  });

  document.getElementById('close').addEventListener('click', () => {
    window.ipcRenderer.send('close-window');
  });

  // Use event delegation for dynamically created checkboxes
  bossesDiv.addEventListener('change', event => {
    if (event.target && event.target.matches('input[type="checkbox"]')) {
      updateCounter();
    }
  });
});
