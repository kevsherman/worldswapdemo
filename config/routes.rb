Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  get '/', to: 'home#index'
  
  resources :listings, only: [:index, :new] do
    collection do 
      get 'display_token_to_list'
      get 'display_token_for_sale'
    end
  end

end
