import React from 'react'
import { Settings as SettingsIcon, User, Bell, Shield } from 'lucide-react'
import './Settings.css'

const Settings = () => {
  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>Configurações</h1>
        <p>Gerencie as configurações do sistema</p>
      </div>

      <div className="settings-content">
        <div className="settings-section">
          <div className="section-header">
            <User size={24} />
            <h2>Perfil</h2>
          </div>
          <div className="section-content">
            <p>Configurações do seu perfil de usuário</p>
            <button className="btn btn-primary">Editar Perfil</button>
          </div>
        </div>

        <div className="settings-section">
          <div className="section-header">
            <Bell size={24} />
            <h2>Notificações</h2>
          </div>
          <div className="section-content">
            <p>Configure suas preferências de notificação</p>
            <button className="btn btn-primary">Configurar</button>
          </div>
        </div>

        <div className="settings-section">
          <div className="section-header">
            <Shield size={24} />
            <h2>Segurança</h2>
          </div>
          <div className="section-content">
            <p>Configurações de segurança e privacidade</p>
            <button className="btn btn-primary">Alterar Senha</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
