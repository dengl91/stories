/* Stories component script */

document.addEventListener('DOMContentLoaded', () => {
	const storiesContent = document.querySelector('.stories__content');
	const timeOut = storiesContent.dataset.timeout;

	const modal = document.createElement('div');
	modal.classList.add('modal__wrap');

	const modalContent = document.createElement('div');
	modalContent.classList.add('modal__content');

	const progressContent = document.createElement('div');
	progressContent.classList.add('progress__content');
	progressContent.style.setProperty('--timeout', timeOut + 'ms');

	const nextStory = document.createElement('div');
	nextStory.classList.add('modal__next');

	const modalClose = document.createElement('div');
	modalClose.classList.add('modal__close');

	modal.appendChild(modalContent);
	modal.appendChild(progressContent);
	modal.appendChild(nextStory);
	modal.appendChild(modalClose);

	document.body.appendChild(modal);

	const stories = document.querySelectorAll('.stories__item');

	let globalProcess;

	if (stories && modal && modalContent) {

		stories.forEach((story) => {
			story.addEventListener('click', (e) => {
				clearGlobalProcess();
				processStoriesGroup(e.currentTarget);
			});
		});

		modalClose.addEventListener('click', () => {
			clearGlobalProcess();
			modal.classList.remove('active');
		});

	} else {
		console.error('Missing key elements');
	}

	function processStoriesGroup(e) {
		const content = JSON.parse(e.querySelector('.stories__data').textContent);
		if (content) {
			progressContent.innerHTML = '';

			content.forEach(() => {
				const progressItem = document.createElement('div');
				progressItem.classList.add('progress__item');

				progressContent.append(progressItem);
			});

			modal.classList.add('active');
			modalContent.innerHTML = '';

			processStory(0, content, e);
		} else {
			console.error('Missing content data in stories item');
		}
	}

	function processStory(index, content, e) {
		clearGlobalProcess();

		stories.forEach(item => item.classList.remove('active'));
		e.classList.add('active');

		storiesContent.dataset.index = index;

		if (!modal.classList.contains('active')) {
			return;
		}

		if (index >= content.length) {
			if (e.nextElementSibling) {
				e.nextElementSibling.click();
			} else {
				modal.classList.remove('active');
			}
			return;
		}

		modalContent.innerHTML = '';

		const url = content[index];
		const ext = url.split('.').pop();

		if (ext === 'jpg' || ext === 'jpeg' || ext === 'png' || ext === 'svg') {
			const image = document.createElement('img');
			image.src = url;

			modalContent.appendChild(image);

			if (!globalProcess) {
				globalProcess = setInterval(processStory, timeOut, index + 1, content, e);
			}

			fillProgressItem(index);
		} else if (ext === 'mp4') {
			const player = document.createElement('video');
			player.autoplay = true;
			player.muted = true;
			player.controls = false;
			player.allowFullscreen = false;
			player.src = url;

			modalContent.appendChild(player);

			player.addEventListener('loadedmetadata', function () {
				const videoDuration = player.duration * 1000;

				fillProgressItem(index, videoDuration);

				if (!globalProcess) {
					globalProcess = setInterval(processStory, videoDuration, index + 1, content, e);
				}
			});
		}
	}

	nextStory.addEventListener('click', () => {
		const index = parseInt(storiesContent.dataset.index);

		const currentStory = document.querySelector('.stories__item.active');
		const content = JSON.parse(currentStory.querySelector('.stories__data').textContent);

		console.log(index);
		console.log(content);

		processStory(index + 1, content, currentStory);
	});

	function fillProgressItem(index, videoDuration = null) {
		const progressItems = document.querySelectorAll('.progress__item');

		progressItems.forEach(item => item.classList.remove('active'));
		progressItems[index].classList.add('active');

		if (videoDuration) {
			progressItems[index].style.setProperty('--timeout', videoDuration + 'ms');
		}
	}

	function clearGlobalProcess() {
		clearInterval(globalProcess);
		globalProcess = null;
	}

});