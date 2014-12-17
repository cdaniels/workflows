$ = require 'jquery'

do fill = (item = 'Awesome minds on Earth') ->
  $('.tagline').append "#{item}"
fill
