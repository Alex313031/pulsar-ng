'use strict';

const TextEditor = require('./text-editor');
const PaneContainer = require('./pane-container');

/**
 * @class WorkspaceCenter
 * @classdesc Essential: Represents the workspace at the center of the entire
 * window.
 */
module.exports = class WorkspaceCenter {
  constructor(params) {
    params.location = 'center';
    this.paneContainer = new PaneContainer(params);
    this.didActivate = params.didActivate;
    this.paneContainer.onDidActivatePane(() => this.didActivate(this));
    this.paneContainer.onDidChangeActivePane(pane => {
      params.didChangeActivePane(this, pane);
    });
    this.paneContainer.onDidChangeActivePaneItem(item => {
      params.didChangeActivePaneItem(this, item);
    });
    this.paneContainer.onDidDestroyPaneItem(item =>
      params.didDestroyPaneItem(item)
    );
  }

  destroy() {
    this.paneContainer.destroy();
  }

  serialize() {
    return this.paneContainer.serialize();
  }

  deserialize(state, deserializerManager) {
    this.paneContainer.deserialize(state, deserializerManager);
  }

  activate() {
    this.getActivePane().activate();
  }

  getLocation() {
    return 'center';
  }

  setDraggingItem() {
    // No-op
  }

  /*
  Section: Event Subscription
  */

  // Essential: Invoke the given callback with all current and future text
  // editors in the workspace center.
  //
  // * `callback` {Function} to be called with current and future text editors.
  //   * `editor` An {TextEditor} that is present in {::getTextEditors} at the time
  //     of subscription or that is added at some later time.
  //
  // Returns a {Disposable} on which `.dispose()` can be called to unsubscribe.
  observeTextEditors(callback) {
    for (let textEditor of this.getTextEditors()) {
      callback(textEditor);
    }
    return this.onDidAddTextEditor(({ textEditor }) => callback(textEditor));
  }

  /**
   * @name observePaneItems
   * @memberof WorkspaceCenter
   * @desc Essential: Invoke the given callback with all current and future panes
   * items in the workspace center.
   * @param {WorkspaceCenter.observePaneItemsCallback} callback -
   * Function to be called with current and future pane items.
   * @returns {Disposable} Returns a Disposable on which `.dispose()` can be called
   * to unsubscribe.
   */
  observePaneItems(callback) {
    /**
     * @callback observePaneItemsCallback
     * @memberof WorkspaceCenter
     * @param {object} item - An item that is present in {::getPaneItems} at the
     * time of subscription or that is added at some later time.
     */
    return this.paneContainer.observePaneItems(callback);
  }

  // Essential: Invoke the given callback when the active pane item changes.
  //
  // Because observers are invoked synchronously, it's important not to perform
  // any expensive operations via this method. Consider
  // {::onDidStopChangingActivePaneItem} to delay operations until after changes
  // stop occurring.
  //
  // * `callback` {Function} to be called when the active pane item changes.
  //   * `item` The active pane item.
  //
  // Returns a {Disposable} on which `.dispose()` can be called to unsubscribe.
  onDidChangeActivePaneItem(callback) {
    return this.paneContainer.onDidChangeActivePaneItem(callback);
  }

  // Essential: Invoke the given callback when the active pane item stops
  // changing.
  //
  // Observers are called asynchronously 100ms after the last active pane item
  // change. Handling changes here rather than in the synchronous
  // {::onDidChangeActivePaneItem} prevents unneeded work if the user is quickly
  // changing or closing tabs and ensures critical UI feedback, like changing the
  // highlighted tab, gets priority over work that can be done asynchronously.
  //
  // * `callback` {Function} to be called when the active pane item stopts
  //   changing.
  //   * `item` The active pane item.
  //
  // Returns a {Disposable} on which `.dispose()` can be called to unsubscribe.
  onDidStopChangingActivePaneItem(callback) {
    return this.paneContainer.onDidStopChangingActivePaneItem(callback);
  }

  // Essential: Invoke the given callback with the current active pane item and
  // with all future active pane items in the workspace center.
  //
  // * `callback` {Function} to be called when the active pane item changes.
  //   * `item` The current active pane item.
  //
  // Returns a {Disposable} on which `.dispose()` can be called to unsubscribe.
  observeActivePaneItem(callback) {
    return this.paneContainer.observeActivePaneItem(callback);
  }

  // Extended: Invoke the given callback when a pane is added to the workspace
  // center.
  //
  // * `callback` {Function} to be called panes are added.
  //   * `event` {Object} with the following keys:
  //     * `pane` The added pane.
  //
  // Returns a {Disposable} on which `.dispose()` can be called to unsubscribe.
  onDidAddPane(callback) {
    return this.paneContainer.onDidAddPane(callback);
  }

  // Extended: Invoke the given callback before a pane is destroyed in the
  // workspace center.
  //
  // * `callback` {Function} to be called before panes are destroyed.
  //   * `event` {Object} with the following keys:
  //     * `pane` The pane to be destroyed.
  //
  // Returns a {Disposable} on which `.dispose()` can be called to unsubscribe.
  onWillDestroyPane(callback) {
    return this.paneContainer.onWillDestroyPane(callback);
  }

  // Extended: Invoke the given callback when a pane is destroyed in the
  // workspace center.
  //
  // * `callback` {Function} to be called panes are destroyed.
  //   * `event` {Object} with the following keys:
  //     * `pane` The destroyed pane.
  //
  // Returns a {Disposable} on which `.dispose()` can be called to unsubscribe.
  onDidDestroyPane(callback) {
    return this.paneContainer.onDidDestroyPane(callback);
  }

  // Extended: Invoke the given callback with all current and future panes in the
  // workspace center.
  //
  // * `callback` {Function} to be called with current and future panes.
  //   * `pane` A {Pane} that is present in {::getPanes} at the time of
  //      subscription or that is added at some later time.
  //
  // Returns a {Disposable} on which `.dispose()` can be called to unsubscribe.
  observePanes(callback) {
    return this.paneContainer.observePanes(callback);
  }

  // Extended: Invoke the given callback when the active pane changes.
  //
  // * `callback` {Function} to be called when the active pane changes.
  //   * `pane` A {Pane} that is the current return value of {::getActivePane}.
  //
  // Returns a {Disposable} on which `.dispose()` can be called to unsubscribe.
  onDidChangeActivePane(callback) {
    return this.paneContainer.onDidChangeActivePane(callback);
  }

  // Extended: Invoke the given callback with the current active pane and when
  // the active pane changes.
  //
  // * `callback` {Function} to be called with the current and future active#
  //   panes.
  //   * `pane` A {Pane} that is the current return value of {::getActivePane}.
  //
  // Returns a {Disposable} on which `.dispose()` can be called to unsubscribe.
  observeActivePane(callback) {
    return this.paneContainer.observeActivePane(callback);
  }

  // Extended: Invoke the given callback when a pane item is added to the
  // workspace center.
  //
  // * `callback` {Function} to be called when pane items are added.
  //   * `event` {Object} with the following keys:
  //     * `item` The added pane item.
  //     * `pane` {Pane} containing the added item.
  //     * `index` {Number} indicating the index of the added item in its pane.
  //
  // Returns a {Disposable} on which `.dispose()` can be called to unsubscribe.
  onDidAddPaneItem(callback) {
    return this.paneContainer.onDidAddPaneItem(callback);
  }

  // Extended: Invoke the given callback when a pane item is about to be
  // destroyed, before the user is prompted to save it.
  //
  // * `callback` {Function} to be called before pane items are destroyed.
  //   * `event` {Object} with the following keys:
  //     * `item` The item to be destroyed.
  //     * `pane` {Pane} containing the item to be destroyed.
  //     * `index` {Number} indicating the index of the item to be destroyed in
  //       its pane.
  //
  // Returns a {Disposable} on which `.dispose` can be called to unsubscribe.
  onWillDestroyPaneItem(callback) {
    return this.paneContainer.onWillDestroyPaneItem(callback);
  }

  /**
   * @name onDidDestroyPaneItem
   * @memberof WorkspaceCenter
   * @desc Extended: Invoke the given callback when a pane item is destroyed.
   * @param {WorkspaceCenter.onDidDestroyPaneItemCallback} callback - Function to
   * be called when pane items are destroyed.
   * @returns {Disposable} On which `.dispose()` can be called to unsubscribe.
   */
  onDidDestroyPaneItem(callback) {
    /**
     * @callback onDidDestroyPaneItemCallback
     * @memberof WorkspaceCenter
     * @param {object} event - Object with the following keys:
     * @param {*} event.item - The destroyed item.
     * @param {Pane} event.pane - Containing the destroyed item.
     * @param {integer} event.index - Indicating the index of the destroyed item
     * in its pane.
     */
    return this.paneContainer.onDidDestroyPaneItem(callback);
  }

  /**
   * @name onDidAddTextEditor
   * @memberof WorkspaceCenter
   * @desc Extended: Invoke the given callback when a text editor is added to the
   * workspace center.
   * @param {WorkspaceCenter.onDidAddTextEditorCallback} callback - Function to be
   * called when panes are added.
   * @returns {Disposable} on which `.dispose()` can be called to unsubscribe.
   */
  onDidAddTextEditor(callback) {
    return this.onDidAddPaneItem(({ item, pane, index }) => {
      if (item instanceof TextEditor) {
        /**
         * @callback onDidAddTextEditorCallback
         * @memberof WorkspaceCenter
         * @param {object} event - Object with following keys:
         * @param {TextEditor} event.textEditor - The TextEditor that was added.
         * @param {Pane} event.pane - Pane containing the added text editor.
         * @param {integer} event.index - Number indicating the index of the added text
         * editor in it's pane.
         */
        callback({ textEditor: item, pane, index });
      }
    });
  }

  /**
   * @name getPaneItems
   * @memberof WorkspaceCenter
   * @desc Essential: Get all pane items in the workspace center.
   * @returns {array} Returns an array of items.
   */
  getPaneItems() {
    return this.paneContainer.getPaneItems();
  }

  /**
   * @name getActivePaneItem
   * @memberof WorkspaceCenter
   * @desc Essential: Get the active {Pane}'s active item.
   * @returns {object} A Pane Item
   */
  getActivePaneItem() {
    return this.paneContainer.getActivePaneItem();
  }

  /**
   * @name getTextEditors
   * @memberof WorkspaceCenter
   * @desc Essential: Get all text editors in the workspace center.
   * @returns {TextEditor[]}
   */
  getTextEditors() {
    return this.getPaneItems().filter(item => item instanceof TextEditor);
  }

  /**
   * @name getActiveTextEditor
   * @memberof WorkspaceCenter
   * @desc Essential: Get the active item if it is an {TextEditor}.
   * @returns {TextEditor|undefined} Returns TextEditor or `undefined` if the
   * current active item is not an {TextEditor}
   */
  getActiveTextEditor() {
    const activeItem = this.getActivePaneItem();
    if (activeItem instanceof TextEditor) {
      return activeItem;
    }
  }

  /**
   * @name saveAll
   * @memberof WorkspaceCenter
   * @desc Save all pane items.
   */
  saveAll() {
    this.paneContainer.saveAll();
  }

  confirmClose(options) {
    return this.paneContainer.confirmClose(options);
  }

  /**
   * @name getPanes
   * @memberof WorkspaceCenter
   * @desc Extended: Get all panes in the workspace center.
   * @returns {Pane[]}
   */
  getPanes() {
    return this.paneContainer.getPanes();
  }

  /**
   * @name getActivePane
   * @memberof WorkspaceCenter
   * @desc Extended: Get the active {Pane}.
   * @returns {Pane}
   */
  getActivePane() {
    return this.paneContainer.getActivePane();
  }

  /**
   * @name activateNextPane
   * @memberof WorkspaceCenter
   * @desc Extended: Make the next pane active.
   */
  activateNextPane() {
    return this.paneContainer.activateNextPane();
  }

  /**
   * @name activatePreviousPane
   * @memberof WorkspaceCenter
   * @desc Extended: Make the previous pane active.
   */
  activatePreviousPane() {
    return this.paneContainer.activatePreviousPane();
  }

  paneForURI(uri) {
    return this.paneContainer.paneForURI(uri);
  }

  paneForItem(item) {
    return this.paneContainer.paneForItem(item);
  }

  /**
   * @name destroyActivePane
   * @memberof WorkspaceCenter
   * @desc Destroy (close) the active pane.
   */
  destroyActivePane() {
    const activePane = this.getActivePane();
    if (activePane != null) {
      activePane.destroy();
    }
  }
};
