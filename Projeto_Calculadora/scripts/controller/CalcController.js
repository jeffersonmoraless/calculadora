class CalcController{

    constructor(){
        this._audio = new Audio('click.mp3');
        this._audioOnOff = 'false';
        this._lastOperator = '';
        this._lastNumber = '';
        this._result = '';

        this._operation = [];
        this._locale ="pt-BR";
        this._displayCalcEl =document.querySelector("#display");
        this._displayDateEl = document.querySelector("#data");
        this._displayTimeEl = document.querySelector("#hora");
        this._currentDate;
        this.inicia();
        this.initButtonsEvents();
        this.initKeyboard();
        this.getLastOperation();
        
    }
    pasteFromClipboard(){
        document.addEventListener('paste', e =>{
           let text = e.clipboardData.getData('Text');
           this.displayCalc = parseFloat(text);
           console.log("colado", text);
        });
    }
    copyToClipboard(){
        let input = document.createElement('input');
        input.value = this.displayCalc;
        document.body.appendChild(input);
        input.select();
        document.execCommand("Copy");
        input.remove();



    }
    inicia(){
            this.setDisplayDateTime();
        setInterval(()=>{
            this.setDisplayDateTime();
        },1000);
        this.setLastNumberToDisplay();
        this.pasteFromClipboard();
        document.querySelectorAll('.btn-ac').forEach(btn => {
            btn.addEventListener('dblclick', e=>{
                this.toggleAudio();
            });
        });
        //this.displayCalc = 'morales';
        
    }
    toggleAudio(){
        this._audioOnOff = !this._audioOnOff;

    }
    playAudio(){
        if(this._audioOnOff){
            this._audio.currentTime = 0;
            this._audio.play();

        }
    }
    initKeyboard(){
        
        document.addEventListener('keyup', e=>{
            this.playAudio();
            switch(e.key){
                case 'Escape':
                    //limpa tudo
                    this.clearAll();
                break;
                case 'Backspace':
                    //limpa ultima entrada
                    this.clearEntry();
                break;
                case '%':
                case '/':
                case '*':
                case '-':
                case '+':
                      this.addOperation(e.key);
            break;	
                case '.':
            case ',': 
                    this.addDot();
            break;
            case '=':
            case 'Enter': 
                this.calc();               
                break;
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':            
                case '8':
                case '9':
                    this.addOperation(parseInt(e.key));
                break;
                case 'c':
                    if(e.ctrlKey)this.copyToClipboard();
                break;
            } 
         });
    }
    clearAll(){
        this._operation = [];
        this._lastNumber= '';
        this._lastOperator= '';    
        this.setLastNumberToDisplay();
    }
    clearEntry(){
        this._operation.pop();
        this.setLastNumberToDisplay();
    }
    getLastOperation(){
        return this._operation[this._operation.length - 1];


    }
    toReplaceLast(value){
        this._operation[this._operation.length - 1] = value;
    }
    isOperator(value){
        return (['+', '-', '*', '%', '/'].indexOf(value) > -1);
    }
    pushOperation(value){
       
        this._operation.push(value);
        
        if(this._operation.length > 3){

            this.calc();
        
        }
    }
    getResult(){
        try {
            this._result = eval(this._operation.join(""));
            if(this._result.toString().length > 10){
                this._result = this._result.toString().substring(0,10);    
            }return this._result;
        } catch (error) {
            setTimeout(()=>{
                this.setError();    
            },1);
                       
        }
            
            

    }
    getLastItem(isOperator = true){
        
        let lastItem;

        for (let i = this._operation.length-1; i >= 0; i--){
            
            
            
            if(this.isOperator(this._operation[i]) == isOperator){

                lastItem = this._operation[i];
                
                break;
            }
                
        }
        if(!lastItem){
            lastItem =  (isOperator) ? this._lastOperator : this._lastNumber;
        }
        return lastItem;
        
    }
    calc(){
        
        let last = '';

        this._lastOperator = this.getLastItem();
        
        if(this._operation.length < 3){
            let firstItem = this._operation[0];
            this._operation=[firstItem, this._lastOperator, this._lastNumber];
        }
        if(this._operation.length > 3){
            
            last = this._operation.pop();
                                    
            this._lastNumber = this.getResult();

        }else if(this._operation.length == 3){
                        
                this._lastNumber = this.getLastItem(false);
            }
        let result = this.getResult();

        if(last == '%' ){
            result = result / 100;
            this._operation = [result];
        }else{

            this._operation = [result];

            if(last) this._operation.push(last);
        }
            this.setLastNumberToDisplay();

    }
    
    setLastNumberToDisplay(){
        let lastNumber = this.getLastItem(false);
        
        //console.log("tipo erro",lastNumber)
        if(!lastNumber)lastNumber = 0;

        this.displayCalc = lastNumber;


    }
    addOperation(value){
      
        if(isNaN(this.getLastOperation())){
            //String
            if(this.isOperator(value)){
                console.log("2 é uma string");
                this.toReplaceLast(value);
                //trocar operador
            }else{
                this.pushOperation(value);
                console.log("4 é uma string");
                this.setLastNumberToDisplay();
            }
        }else {
            if(this.isOperator(value)){
                console.log("5 é uma string");
                this.pushOperation(value);
            }
        else{
                let newValue = this.getLastOperation().toString() + value.toString();
                this.toReplaceLast(newValue);
                this.setLastNumberToDisplay();        
        }
        }
        console.log(this._operation);
        
    }
    setError(){
        this.displayCalc = 'ERROR';
    }
    addDot(){
        let lastOperation = this.getLastOperation();
        if(typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1 )return;
        console.log("abc",lastOperation);
        if(this.isOperator(lastOperation) || !lastOperation){
            this.pushOperation('0.');
        }else{
            this.toReplaceLast(lastOperation.toString() + '.');
        }
        this.setLastNumberToDisplay();
    }
    /**************************************metodo para switch**********************************************************/
    execBtn(value_textBtn){ 
        this.playAudio();
        switch(value_textBtn){
            case 'ac':
                //limpa tudo
                this.clearAll();
            break;
            case 'ce':
                //limpa ultima entrada
                this.clearEntry();
            break;
            case 'porcento':
                value_textBtn = "%" ;
                this.addOperation(value_textBtn);;               
            break;
            case 'divisao':
                value_textBtn = '/';
                this.addOperation(value_textBtn);
            break;
            case 'multiplicacao':
                value_textBtn = '*';
                this.addOperation(value_textBtn);
            break;
            case 'subtracao':
                value_textBtn = '-';
                this.addOperation(value_textBtn);
            break;
            case 'soma':
                value_textBtn ='+';  
                this.addOperation(value_textBtn);                
            break;
            case 'igual':
                this.calc();
                               
            break;
            case 'ponto':
                value_textBtn = '.'; 
                this.addDot();               
            break;
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':            
            case '8':
            case '9':
                this.addOperation(parseInt(value_textBtn));
            break;
            default:
                this.setError();
            break
        }

    }
    /*-----------------------------------------metodo--------------------------------------------------------------------*/                                                                               
    addEventListenerAll(element, events, funct){
        events.split(' ').forEach(event =>{
            element.addEventListener(event, funct, false )
        });
    }
    /************************************metodo para configurar eventos do Botão*****************************************/
    initButtonsEvents(){
        let buttons = document.querySelectorAll("#buttons > g, #parts > g");
        buttons.forEach((btn, index)=>{
            this.addEventListenerAll(btn,'click drag', e =>{
                let textBtn = btn.className.baseVal.replace("btn-","");
                this.execBtn(textBtn);
            });
            this.addEventListenerAll(btn, 'mouseover mouseup mousedown', e =>{
                btn.style.cursor = "pointer";
            });
            
        })
    }
    
    
    /************************************metodo para configurar horario no display***************************************/
    setDisplayDateTime(){
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale); //hora
        this.displayDate = this.currentDate.toLocaleDateString(this._locale,{ //data
            day:'2-digit',
            month:'long',
            year:'numeric'
        });
    }





    /******************************************************************************************************************** 
     * ******************************************************************************************************************/
    get displayCalc(){
        return this._displayCalcEl.innerHTML;
    }
    set displayCalc(value){
        if(value.length > 10 ){
            this.setError();
            return false;
        }
        this._displayCalcEl.innerHTML = value;
    }

    /*------------------------------------------------------------------------------------------------------------------*/
                                                 /*DATA E HORA*/                                                         
    /*-------------------------------------------------------------------------------------------------------------------*/                                                  
    get currentDate(){
        return new Date();
    }
    set currentDate(value){
        this._currentDate = value;
    }

    get displayTime(){
        return this._displayTimeEl.innerHTML;
    }
    set displayTime(value){
        this._displayTimeEl.innerHTML = value;
    }

    get displayDate(){
        return this._displayDateEl.innerHTML;
    }
    set displayDate(value){
        this._displayDateEl.innerHTML = value;
    }

    
    /********************************************************************************************************************
     * ******************************************************************************************************************/
}