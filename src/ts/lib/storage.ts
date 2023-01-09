class Storage {
	
	storage: any = null;
	
	constructor () {
		this.storage = localStorage;
	};

	get (key: string): any {
		let o = String(this.storage[key] || '');
		if (!o) {
			return;
		};
		let ret = '';
		try { ret = JSON.parse(o); } catch (e) { /**/ };
		return ret;
	};
	
	set (key: string, obj: any, del?: boolean): void {
		if (!key) {
			console.log('[Storage].set: key not specified');
			return;
		};

		if (del) {
			this.delete(key);
		};
		
		let o = this.get(key);
		if ('object' == typeof(o)) {
			for (let i in obj) {
				o[i] = obj[i];
			};
		} else {
			o = obj;
		};
		this.storage[key] = JSON.stringify(o);
	};
	
	delete (key: string) {
		delete(this.storage[key]);
	};

	setToggle (rootId: string, id: string, value: boolean) {
		const obj = this.get('toggle') || {};
		
		obj[rootId] = obj[rootId] || [];
		if (value) {
			obj[rootId].push(id);
		} else {
			obj[rootId] = obj[rootId].filter((it: string) => { return it != id; });
		};
		obj[rootId] = [ ...new Set(obj[rootId]) ];

		this.set('toggle', obj, true);
		return obj;
	};

	getToggle (rootId: string) {
		const map = this.get('toggle') || {};
		return map[rootId] || [];
	};

	checkToggle (rootId: string, id: string): boolean {
		return this.getToggle(rootId).indexOf(id) >= 0;
	};

	setScroll (key: string, rootId: string, scroll: number) {
		const obj = this.get('scroll') || {};
		obj[key] = obj[key] || {};
		obj[key][rootId] = Number(scroll) || 0;
		this.set('scroll', obj, true);
		return obj;
	};

	getScroll (key: string, rootId: string) {
		const obj = this.get('scroll') || {};
		return Number((obj[key] || {})[rootId]) || 0;
	};

	setOnboarding (key: string) {
		const keys = this.get('onboarding') || [];
		
		if (!this.getOnboarding(key)) {
			keys.push(key);
		};

		this.set('onboarding', keys, true);
		return keys;
	};

	getOnboarding (key: string) {
		return (this.get('onboarding') || []).includes(key);
	};

	logout () {
		const keys = [ 
			'accountId', 
			'scroll', 
			'toggle', 
			'crumbs', 
			'tabIndex', 
			'tabStore', 
			'linkSettings', 
			'graph',
			'gateway',
			'dataPath',
			'writing',
			'timezone',
		];

		keys.forEach(key => this.delete(key));
	};
	
};

export default new Storage();