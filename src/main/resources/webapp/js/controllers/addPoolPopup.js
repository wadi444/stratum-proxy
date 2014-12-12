define(
	['jquery', 'ractivejs', 'rv!templates/addPoolPopup', 'bootstrap', 'json'],
	function($, Ractive, template) {

	    var AddPoolPopup = function(parentController, parentElement) {
		this.parentController = parentController;

		this.ractive = new Ractive({
		    el: $('body'),
		    template: template,
		});

		this.updateLabels();

		this.popup = $('#addPoolModal').modal({
		    keyboard: true,
		    backdrop: 'static'
		});
		this.popup.find('.validateButton').off('click').click($.proxy(validate, this));
	    }

	    AddPoolPopup.prototype.updateLabels = function() {
		// Set the i18n labels
		this.ractive.set({
		    title: 'Add a pool',
		    closeButtonLabel: 'Close',
		    poolNameLabel: 'Pool name',
		    poolNamePlaceholder: '',
		    poolNameHelp: 'The name of the pool. If not set, default to pool URL.',
		    poolHostLabel: '',
		    poolHostPlaceholder: '',
		    poolHostHelp: '',
		    usernameLabel: '',
		    usernamePlaceholder: '',
		    usernameHelp: '',
		    passwordLabel: '',
		    passwordPlaceholder: '',
		    passwordHelp: '',
		    priorityLabel: '',
		    priorityPlaceholder: '',
		    priorityHelp: '',
		    weightLabel: '',
		    weightPlaceholder: '',
		    weightHelp: '',
		    enableExtranonceSubscribeLabel: '',
		    enableExtranonceSubscribeHelp: '',
		    startPoolLabel: '',
		    startPoolHelp: '',
		    appendWorkerNamesLabel: '',
		    appendWorkerNamesHelp: '',
		    workerNameSeparatorLabel: '',
		    workerNameSeparatorPlaceholder: '',
		    workerNameSeparatorHelp: '',
		    useWorkerPasswordLabel: '',
		    useWorkerPassword: '',
		    useWorkerPasswordHelp: '',
		    mandatoryFieldsLabel: '',
		    appendWorkerNameMandatoryFieldsLabel: '',
		    userWorkerPaswwordMandatoryFieldsLabel: '',
		    addButtonLabel: '',
		    cancelButtonLabel: '',
		});
	    }

	    function validate() {
		var thisController = this;

		$.ajax({
		    url: '/proxy/pool/add',
		    dataType: "json",
		    type: "POST",
		    data: JSON.stringify(thisController.ractive.get()),
		    contentType: "application/json",
		    context: thisController,
		    success: onSuccess,
		    error: onError
		});
	    }

	    function onSuccess(data) {
		// When priority is set, refresh the
		// list.
		if (data.status == 'Failed') {
		    window.alert('Failed to add the pool. Message: ' + data.message);
		} else {
		    if (data.status == 'PartiallyDone') {
			window.alert('Pool added but not started. Message: ' + data.message);
		    }

		    if (this.parentController != undefined && this.parentController.refresh != undefined) {
			this.parentController.refresh();
		    }
		}
		this.popup.modal('hide');
	    }

	    function onError(request, textStatus, errorThrown) {
		var jsonObject = JSON.parse(request.responseText);
		window.alert('Failed to add the pool. Status: ' + textStatus + ', error: ' + errorThrown
			+ ', message: ' + jsonObject.message);
		this.popup.modal('hide');
	    }

	    return AddPoolPopup;

	});