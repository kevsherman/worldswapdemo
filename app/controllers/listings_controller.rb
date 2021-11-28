class ListingsController < ApplicationController
  def new
    
  end

  def display_token
    respond_to do |f|
      f.js
    end
  end

end