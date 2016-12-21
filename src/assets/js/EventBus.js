import Vue from 'vue'

class EventBus {

	/**
	 * Attach the vue instance that runs this bitch
	 */
	constructor() 
	{
		this.vue = new Vue();
	}


	/**
	 * Emit a given event to the bus channels
	 *
	 * @param {string} event
	 * @param {object | null} data
	 */
	fire(event, data = null)
	{
		this.vue.$emit(event, data);
	}


	/**
	 * Register for the bus to fire a callback when an event occurs
	 *
	 * @param {string} event
	 * @param {closure} callback
	 */
	listen(event, callback)
	{
		this.vue.$on(event, callback);
	}


	/**
	 * Return a closure that will fire when called
	 * 
	 * @param {string} event
	 * @param {object} data
	 * @returns {closure}
	 */
	fireWhenReady(event, data = null)
	{
		return function() { this.fire(event, data) }.bind(this);
	}
}

export default new EventBus()


