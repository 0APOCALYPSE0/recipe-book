import { Directive, ElementRef, HostBinding, HostListener, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
    selector: '[appDropdown]'
})
export class DropdownDirective implements OnInit{
    isOpen:boolean = false;

    constructor(private el:ElementRef, private renderer:Renderer2){

    }

    @HostListener('click') toggleOpen(){
        this.isOpen = !this.isOpen;
        let ul = this.el.nativeElement.children[1];
        (this.isOpen) ? this.renderer.addClass(ul, "show") : this.renderer.removeClass(ul, "show");
    }

    ngOnInit(){
    }
}