// Stack class 
export default class Stack { 
  
    // Array is used to implement stack 
    constructor() 
    { 
        this.items = []; 
    } 
  
    // Functions to be implemented 
    // push(item)
    push(element) 
    { 
        // push element into the items 
        this.items.push(element); 
    }

    getArray() { return this.items.slice(0); };
    setArray(news) { this.items = news; };
    // pop() 
    pop() 
    { 
        // return top most element in the stack 
        // and removes it from the stack 
        // Underflow if stack is empty 
        if (this.items.length === 0) 
            return "Underflow"; 
        return this.items.pop(); 
    } 
    // peek() 
    peek() 
    { 
        // return the top most element from the stack 
        // but does'nt delete it. 
        return this.items[this.items.length - 1]; 
    } 
    // isEmpty() 
    isEmpty() 
    { 
        // return true if stack is empty 
        return this.items.length === 0; 
    }
    length()
    {
        return this.items.length
    }
    // printStack() 
    printStack() 
    { 
        var str = ""; 
        for (var i = 0; i < this.items.length; i++) 
            str += this.items[i] + " "; 
        return str; 
    } 
} 