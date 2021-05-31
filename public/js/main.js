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

const imageUpload = document.querySelector('#editForm #imageUpload');
const imageDeletes = document.querySelectorAll('#editForm #imageDelete input[type=checkbox]');

const setImagesValid = () => {
  imageUpload.setCustomValidity('');
  imageUpload.checkValidity();
  imageDeletes.forEach((image) => {
    image.setCustomValidity('');
    image.checkValidity();
  });
}

const setImagesInvalid = () => {
  imageUpload.setCustomValidity('Cannot delete all images.');
  imageUpload.checkValidity();
  imageDeletes.forEach((image) => {
    image.setCustomValidity('Cannot delete all images.');
    image.checkValidity();
  });
}

const validateImageDeletion = () => {
  const numImagesToDelete = Array.from(imageDeletes).filter((imageDelete) => imageDelete.checked).length;
  const finalNumberOfImages = imageUpload.files.length + imageDeletes.length - numImagesToDelete;

  if (finalNumberOfImages < 1) {
    setImagesInvalid();
  } else {
    setImagesValid();
  }
}

imageUpload?.addEventListener('change', validateImageDeletion);

imageDeletes?.forEach((imageDelete) => {
  imageDelete.addEventListener('change', validateImageDeletion)
});

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
