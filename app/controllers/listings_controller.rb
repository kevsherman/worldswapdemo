class ListingsController < ApplicationController
  
  def index; end
  
  def new; end

  ### Ajax Methods ###
  def display_token_to_list
    respond_to do |f|
      f.js
    end
  end

  def display_token_for_sale
    respond_to do |f|
      f.js
    end
  end
end