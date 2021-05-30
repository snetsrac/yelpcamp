const dates = document.querySelectorAll('.date');

dates.forEach((date) => {
  date.textContent = new Date(date.textContent).toLocaleString('en', {
    dateStyle: 'short',
    timeStyle: 'short'
  });
});


const reviewForm = document.querySelector('#reviewForm');

if (reviewForm) {
  const stars = document.querySelectorAll('#reviewForm input[type="radio"][name="review[rating]"]')

  stars.setValidity = (string) => {
    stars.forEach((star) => {
      star.setCustomValidity(string);
      star.checkValidity();
    });
  };

  stars.forEach((star) => {
    star.addEventListener('click', () => {
      if (stars[0].checked) {
        stars.setValidity('invalid');
      } else {
        stars.setValidity('');
      }
    });
  });

  reviewForm.addEventListener('submit', () => {
    if (stars[0].checked) {
      stars.setValidity('invalid');
    } else {
      stars.setValidity('');
    }
  });
}

const forms = document.querySelectorAll('.needs-validation')
    
forms.forEach((form) => {
  form.addEventListener('submit', (event) => {
    if (!form.checkValidity()) {
      event.preventDefault()
      event.stopPropagation()
    }

    form.classList.add('was-validated')
  });
});
