export class nodeDom {
    /**
     * @param {String} name
     * @param {Object | null} props
     * @param {Array} childrens
     * @param {nodeDom} parent 父节点
     * @param {Number} layer 层数
    */
    constructor(name = '', props = null, childrens = [], parent = null, layer = 0) {
        this.name = name;
        this.props = props;
        this.childrens = childrens;
        this.parent = parent;
        if(parent instanceof nodeDom) {
            this.layer = parent.layer + 1;
        }else {
            this.layer = layer;
        }
    }

    addChildren(item) {
        this.childrens.push(item);
    }

    render() {
        const { name, props, childrens, layer } = this;
        let domStr = name;
        let valStrArr = [];
        let childStr = '';
        let tabsNum = layer;
        let tabsStr = '';
        if(props) {
            for(let item in props) {
                domStr += `-${item}:${props[item]}`;
            }
        }
        while(tabsNum--) {
            tabsStr += '\t'
        }
        for(let i = 0; i < childrens.length; i++) {
            let item = childrens[i];
            if(item instanceof nodeDom) {
                
                childStr += `${tabsStr}${item.render()}`
            }else {
                valStrArr.push(item);
            }
        }
        if(valStrArr.length) {
            domStr += `-value:${valStrArr.join(',')}`
        }
        domStr +='\n'
        return domStr += childStr;
    }
}