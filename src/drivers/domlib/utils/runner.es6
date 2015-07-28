var runner_ensureInDOM;
(function () {
	runner_ensureInDOM = function (runner) {
		var parent = runner.$.get(0).parentNode,
			inPage = false;
		while(parent != null) {
			if (parent.nodeType === Node.DOCUMENT_NODE) {
				inPage = true;
				break;
			}
			parent = parent.parentNode;
		}
		if (inPage)
			return;

		runner.$.appendTo('body');
		runner.always(() => runner.$.remove());
	};
}());