//Hope it helps you! author: Solid Snake (sergio.burdisso@gmail.com)

function doTheyOverlap(div0, div1){return (yInstersection(div0, div1) && xInstersection(div0, div1));}

function findSmallestY(div0, div1){
	return (div0.offset().top < div1.offset().top)? div0 : div1;
}
function yInstersection(div0, div1){
	var divY0 = findSmallestY(div0, div1);
	var divY1 = (div0 != divY0)? div0 : div1;
	
	return (divY0.offset().top + divY0.height()) - divY1.offset().top > 0;
}

function findSmallestX(div0, div1){
	return (div0.offset().left < div1.offset().left)? div0 : div1;
}

function xInstersection(div0, div1){
	var divX0 = findSmallestX(div0, div1);
	var divX1 = (div0 != divX0)? div0 : div1;
	
	return (divX0.offset().left + divX0.width()) - divX1.offset().left > 0;
}