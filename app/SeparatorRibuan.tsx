export default (nominal: any, separator = ".") => {
  return nominal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator)
}

// export default x => {
//   x = x.toString();
//   var pattern = /(-?\d+)(\d{3})/;
//   while (pattern.test(x)) x = x.replace(pattern, '$1.$2');
//   return x;
// };
