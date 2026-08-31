const form = document.getElementById('meeting-form');
const confirmation = document.getElementById('confirmation');

form.addEventListener('submit', function (event) {
  event.preventDefault();
  const name = document.getElementById('name').value.trim();
  const date = document.getElementById('date').value;
  const time = document.getElementById('time').value;
  confirmation.textContent = `Thanks, ${name}! Your meeting is requested for ${date} at ${time}.`;
  confirmation.hidden = false;
  form.reset();
});
